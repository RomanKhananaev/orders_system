using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using orders_system.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace orders_system.Controllers
{


    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly orders_systemContext _db;

        public UsersController(orders_systemContext db)
        {
            _db = db;
        }

        [HttpPost("Login")]
        public async Task<ActionResult<LoginFormObj>> Login(LoginFormObj loginFormObj)
        {


            var user = _db.Users.FirstOrDefault(x => x.UserName == loginFormObj.UserName);
            if (user == null)
            {
                return BadRequest("User name or password wrong");
            }
            //using var hmac = new HMACSHA512();
            //user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginFormObj.Password));
            //user.PasswordSalt = hmac.Key;
            //_db.SaveChanges();

            using var hmac = new HMACSHA512(user.PasswordSalt);
            var ComputedPassHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginFormObj.Password));
            for (int ii = 0; ii < ComputedPassHash.Length; ii++)
            {
                if (ComputedPassHash[ii] != user.PasswordHash[ii])
                {
                    return BadRequest("User name or password wrong");
                }
            }


            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("superSecretKey@345"));
            var singingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var tokenOptions = new JwtSecurityToken(
                issuer: "https://localhost:7269",
                audience: "https://localhost:7269",
                claims: new List<Claim>(),
                expires: DateTime.Now.AddMinutes(5),
                signingCredentials: singingCredentials
                );
            user.PasswordHash = null;
            user.PasswordSalt = null;



            var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
            return Ok(new { Token = tokenString, User = user });


        }

        [HttpPost("GetUsersByRole/{roleId}")]
        [Authorize]
        public async Task<ActionResult> GetUsersByRole(int roleId)
        {
            var role = _db.UserRoleTypes.FirstOrDefault(x => x.Id == roleId);
            if (role == null)
            {
                return BadRequest("RoleId is wrong");
            }
            var userList = _db.Users.Where(x => x.UserRoleId == roleId)
                .Select(x => new
                {
                    x.Id,
                    x.UserName,
                    x.FirstName,
                    x.LastName,
                    x.Email,
                    x.PhoneNumber,
                    x.Fax,
                    x.CompanyName,
                    x.Address,
                    x.UserRoleId,
                })
                .ToList();
            return Ok(userList);
        }

        [HttpPost("GetOrders/{userId}")]
        [Authorize]
        public async Task<ActionResult> GetOrders(int userId)
        {
            var user = _db.Users.FirstOrDefault(x => x.Id == userId);
            if (user == null)
            {
                return BadRequest("User not found");
            }
            var ordersList = _db.Orders.Where(x => x.UserId == userId)
                .Select(x => new
                {
                    x.Id,
                    x.Date,
                    x.TotalPrice,
                    x.Description,
                    x.SellerName
                })
                .ToList();
            return Ok(ordersList);
        }
        [HttpPost("GetOrdersSum")]
        [Authorize]
        public async Task<ActionResult> GetOrdersSum(OrdersSumObj OrdersSumObj)
        {
            var user = _db.Users.FirstOrDefault(x => x.Id == OrdersSumObj.userId);
            if (user == null)
            {
                return BadRequest("User not found");
            }
            var orderList = _db.Orders.Where(x => x.UserId == OrdersSumObj.userId && x.Date >= OrdersSumObj.From && x.Date <= OrdersSumObj.To)
               .Select(x => new
               {
                   x.TotalPrice,
               })
                .ToList();
            var sum = 0.0;
            foreach (var order in orderList)
            {
                sum += order.TotalPrice;
            }
            return Ok(sum);
        }

    }



    public struct LoginFormObj
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }

    public struct OrdersSumObj
    {
        public int userId { get; set; }
        public DateTime From { get; set; }
        public DateTime To { get; set; }


    }
}

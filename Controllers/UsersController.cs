using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using orders_system.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
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
        public async Task<ActionResult<LoginForm>> Login(LoginForm loginForm)
        {
            var user = _db.Users.FirstOrDefault(x => x.UserName == loginForm.UserName);
            if (user == null || user.Password != loginForm.Password)
            {
                return BadRequest("User name or password wrong");
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
            var userDto = new userDto
            {
                Id = user.Id,
                Email = user.Email,
                UserName = user.UserName,
                UserRole = user.UserRoleId == 1? "Admin":"User",
            };
            

            var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
            return Ok(new {Token = tokenString, User = userDto });

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
                    x.Email
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
                })
                .ToList();
            return Ok(ordersList);
        }
        [HttpPost("GetOrdersSum")]
        [Authorize]
        public async Task<ActionResult> GetOrdersSum(OrdersSumDTO ordersSumDTO)
        {
            var user = _db.Users.FirstOrDefault(x => x.Id == ordersSumDTO.userId);
            if (user == null)
            {
                return BadRequest("User not found");
            }
            var orderList = _db.Orders.Where(x => x.UserId == ordersSumDTO.userId && x.Date >= ordersSumDTO.From && x.Date <= ordersSumDTO.To)
               .Select(x => new
               {
                   x.Id,
                   x.Date,
                   x.TotalPrice,
               })
                .ToList();
            return Ok(orderList);
        }

    }



    public struct LoginForm
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }

    public struct userDto
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string UserRole { get; set; }
    }
    public struct OrdersSumDTO
    {
        public int userId { get; set; }
        public DateTime From { get; set; }
        public DateTime To { get; set; }


    }
}

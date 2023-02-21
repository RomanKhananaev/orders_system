using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using orders_system.Models;

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
        public async Task<ActionResult<LoginForm>>Login(LoginForm loginForm)
        {
            var user = _db.Users.FirstOrDefault(x => x.UserName == loginForm.UserName);
            if (user == null || user.Password != loginForm.Password)
            {
                return BadRequest("User name or password wrong");
            }

            return Ok(user);
            
        }

        [HttpPost("GetUsersByRole/{roleId}")]
        public async Task<ActionResult> GetUsersByRole(int roleId)
        {
            var role = _db.UserRoleTypes.FirstOrDefault(x => x.Id == roleId);
            if(role == null)
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

    }



    public struct LoginForm
    {
        public string UserName { get; set; }
        public string Password { get; set; }    
    }
}

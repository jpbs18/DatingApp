using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly ITokenService _service;

        public AccountController(DataContext context, ITokenService service) 
        {
            _context = context;
            _service = service;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register([FromBody] RegisterDto dto)
        {
            if (await UserExists(dto.Username))
            {
                return BadRequest("That name is already taken.");
            }
                 
            using var hmac = new HMACSHA512();
            var user = new AppUser
            {
                UserName = dto.Username.ToLower(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(dto.Password)),
                PasswordSalt = hmac.Key
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var userDto = new UserDto
            {
                Username = user.UserName,
                Token = _service.CreateToken(user)
            };

            return Ok(userDto);
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login([FromBody] LoginDto dto)
        {
            if (!(await UserExists(dto.Username))) 
            { 
                return Unauthorized("Invalid username"); 
            }

            var user = await _context.Users.SingleOrDefaultAsync(user => user.UserName.ToLower() == dto.Username.ToLower());

            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(dto.Password));

            for(int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i]) 
                {
                    return Unauthorized("Invalid password");
                }
            }

            var userDto = new UserDto
            {
                Username = user.UserName,
                Token = _service.CreateToken(user)
            };
                         
            return Ok(userDto);
        }

        private async Task<bool> UserExists(string username) => await _context.Users.AnyAsync(user => user.UserName.ToLower() == username.ToLower());
    }
}

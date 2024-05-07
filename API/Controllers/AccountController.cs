using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
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
        private readonly IMapper _mapper;

        public AccountController(DataContext context, ITokenService service, IMapper mapper) 
        {
            _context = context;
            _service = service;
            _mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register([FromBody] RegisterDto dto)
        {
            if (await UserExists(dto.Username))
            {
                return BadRequest("That name is already taken.");
            }

            var user = _mapper.Map<AppUser>(dto);
                 
            using var hmac = new HMACSHA512();

            user.UserName = dto.Username.ToLower();
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(dto.Password));
            user.PasswordSalt = hmac.Key;
            
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var userDto = new UserDto
            {
                Username = user.UserName,
                Token = _service.CreateToken(user),
                KnownAs = user.KnownAs,
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

            var user = await _context.Users
                .Include(user => user.Photos)
                .SingleOrDefaultAsync(user => user.UserName.ToLower() == dto.Username.ToLower());

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
                Token = _service.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(photo => photo.IsMain)?.Url,
                KnownAs = user.KnownAs
            };
                         
            return Ok(userDto);
        }

        private async Task<bool> UserExists(string username) => await _context.Users.AnyAsync(user => user.UserName.ToLower() == username.ToLower());
    }
}

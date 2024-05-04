using API.DTOs;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        public readonly IUserRepository _repository;
        private readonly IMapper _mapper;

        public UsersController(IUserRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            var users = await _repository.GetMembersAsync();          
            return Ok(users);
        }

        [HttpGet("username/{username}")]
        public async Task<ActionResult<MemberDto>> GetUserByUserName(string username)
        {
            var user = await _repository.GetMemberByUserNameAsync(username);
            return Ok(user);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto dto)
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _repository.GetUserByUserNameAsync(username);

            if (user is null) return NotFound();

            _mapper.Map(dto, user);

            return await _repository.SaveAllAsync() ? NoContent() : BadRequest("Failed to update user");
        }
    }
}

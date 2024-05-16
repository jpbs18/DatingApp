using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;

namespace API.Controllers
{  
    [Authorize]
    [ApiController]
    [ServiceFilter(typeof(UserActivity))]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        public readonly IUserRepository _repository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public UsersController(IUserRepository repository, IMapper mapper, IPhotoService photoService)
        {
            _repository = repository;
            _mapper = mapper;
            _photoService = photoService;
        }

        [HttpGet]
        public async Task<ActionResult<PageList<MemberDto>>> GetUsers([FromQuery] UserParams userParams)
        {
            var currentUser = await _repository.GetMemberByUserNameAsync(User.GetUsername());
            userParams.UserName = currentUser.UserName;

            if (string.IsNullOrWhiteSpace(userParams.Gender))
            {
                userParams.Gender = currentUser.Gender == "male" ? "female" : "male";
            }
           
            var users = await _repository.GetMembersAsync(userParams);
            Response.AddPaginationHeader(new PaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages));

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
            var user = await _repository.GetUserByUserNameAsync(User.GetUsername());

            if (user is null) return NotFound();

            _mapper.Map(dto, user);

            return await _repository.SaveAllAsync() ? NoContent() : BadRequest("Failed to update user");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var user = await _repository.GetUserByUserNameAsync(User.GetUsername());

            if (user is null) return NotFound();

            var result = await _photoService.AddPhotoAsync(file);

            if(result.Error is not null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if (user.Photos.Count == 0) photo.IsMain = true;

            user.Photos.Add(photo);

            return await _repository.SaveAllAsync() 
                ? CreatedAtAction(nameof(GetUserByUserName), new { username = user.UserName }, _mapper.Map<PhotoDto>(photo)) 
                : BadRequest("Problem adding photo");
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await _repository.GetUserByUserNameAsync(User.GetUsername());

            if(user is null) return NotFound();

            var photo = user.Photos.FirstOrDefault(photo => photo.Id == photoId);

            if (photo is null) return NotFound();
            if (photo.IsMain) return BadRequest("This photo is already the main photo");

            var currentMainPhoto = user.Photos.FirstOrDefault(photo => photo.IsMain);
            
            if(currentMainPhoto is not null) currentMainPhoto.IsMain = false;
            
            photo.IsMain = true;

            return await _repository.SaveAllAsync() ? NoContent() : BadRequest("Something went wrong");
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _repository.GetUserByUserNameAsync(User.GetUsername());
            var photo = user.Photos.FirstOrDefault(photo => photo.Id == photoId);

            if (photo is null) return NotFound();
            if (photo.IsMain) return BadRequest("Cannot delete main photo");

            if(photo.PublicId is not null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error is not null) return BadRequest(result.Error.Message);
            }

            user.Photos.Remove(photo);

            return await _repository.SaveAllAsync() ? Ok() : BadRequest("Something went wrong");
        }
    }
}

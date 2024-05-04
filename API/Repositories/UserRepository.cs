using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly IMapper _mapper;
        private readonly DataContext _context;

        public UserRepository(DataContext context, IMapper mapper) 
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<bool> SaveAllAsync() => await _context.SaveChangesAsync() > 0;      
        public void Update(AppUser user) => _context.Entry(user).State = EntityState.Modified; 
        
        public async Task<MemberDto> GetMemberByUserNameAsync(string username) =>
            await _context.Users
                .Where(user => user.UserName == username)
                .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();

        public async Task<IEnumerable<MemberDto>> GetMembersAsync() => 
            await _context.Users
                 .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                 .ToListAsync();

        public async Task<IEnumerable<AppUser>> GetUsersAsync() => await _context.Users.ToListAsync();

        public async Task<AppUser> GetUserByUserNameAsync(string username) =>
            await _context.Users
                .Where(user => user.UserName == username)
                .SingleOrDefaultAsync();
    }
}


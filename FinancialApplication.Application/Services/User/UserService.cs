namespace FinancialApplication.Application.Services.User
{
    using FinancialApplication.Application.Common.Interfaces.Repository;
    using FinancialApplication.Domain.Entities;

    public class UserService : BaseService, IUserService
    {
        public UserService(IRepository repository) : base(repository)
        {
        }

        public async Task CreateUserAsync(UserDto userDto)
        {
            User? existingUser = Repository
                .All<User>(u => u.ExternalIdentityId == userDto.ExternalIdentityId)
                .FirstOrDefault();

            if (existingUser != null)
            {
                throw new InvalidOperationException($"User with external identity id {userDto.ExternalIdentityId} already exists.");
            }

            var user = new User
            {
                ExternalIdentityId = userDto.ExternalIdentityId,
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Email = userDto.Email,
                CreatedOn = DateTime.UtcNow,
            };

            await Repository.AddAsync(user);
            await Repository.SaveChangesAsync();
        }

        public Task DeleteUserAsync(string userId)
        {
            throw new NotImplementedException();
        }

        public async Task<UserDto> GetUserByIdAsync(string userId)
        {
            User? existingUser = Repository.GetByIdAsync<User>(userId).Result;
            if (existingUser == null)
            {
                throw new InvalidOperationException($"User with id {userId} does not exist.");
            }

            if(existingUser == null)
            {
                throw new InvalidOperationException($"User with id {userId} does not exist.");
            }

            return UserDto.UserToUserDto(existingUser);
        }

        public Task UpdateUserAsync(UserDto userDto)
        {
            throw new NotImplementedException();
        }
    }
}

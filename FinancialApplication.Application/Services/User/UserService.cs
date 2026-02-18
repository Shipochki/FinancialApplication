namespace FinancialApplication.Application.Services.User
{
    using FinancialApplication.Application.Common.Interfaces.Repository;
    using FinancialApplication.Domain.Entities;
    using System.ComponentModel.DataAnnotations;

    public class UserService : BaseService, IUserService
    {
        public UserService(IRepository repository) : base(repository)
        {
        }

        public async Task CreateUserAsync(UserDto userDto)
        {
            User? existingUser = Repository.GetByIdAsync<User>(userDto.Id).Result;
            if (existingUser != null)
            {
                throw new InvalidOperationException($"User with id {userDto.Id} already exists.");
            }

            Validator.ValidateObject(userDto, new ValidationContext(userDto), true);

            var user = new User
            {
                ExternalIdentityId = userDto.ExternalIdentityId,
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Email = userDto.Email
            };

            await Repository.AddAsync(user);
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

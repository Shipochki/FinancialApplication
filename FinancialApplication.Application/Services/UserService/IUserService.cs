namespace FinancialApplication.Application.Services.UserService
{
    using FinancialApplication.Domain.Entities;

    public interface IUserService
    {
        public User GetUserByExternalIdAsync(string externalIdentityId);

        public Task CreateUserAsync(UserDto userDto);

        public Task UpdateUserAsync(UserDto userDto);

        public Task DeleteUserAsync(string userId);
    }
}

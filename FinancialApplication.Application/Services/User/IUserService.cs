namespace FinancialApplication.Application.Services.User
{
    public interface IUserService
    {
        public Task<UserDto> GetUserByIdAsync(string externalIdentityId);

        public Task CreateUserAsync(UserDto userDto);

        public Task UpdateUserAsync(UserDto userDto);

        public Task DeleteUserAsync(string userId);
    }
}

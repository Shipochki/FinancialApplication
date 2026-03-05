namespace FinancialApplication.Application.Services.UserService
{
    using FinancialApplication.Domain.Entities;

    public interface IUserService
    {
        public User? GetUserByExternalIdAsync(string externalIdentityId);

        public Task SyncUserAsync(UserDto userDto);

        public Task DeleteUserAsync(string userId);
    }
}

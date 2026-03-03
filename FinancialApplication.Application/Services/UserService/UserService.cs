namespace FinancialApplication.Application.Services.UserService
{
    using FinancialApplication.Application.Common.Interfaces.Repository;
    using FinancialApplication.Domain.Entities;


    public class UserService : BaseService, IUserService
    {
        public UserService(IRepository repository) : base(repository)
        {
        }

        public async Task SyncUserAsync(UserDto userDto)
        {
            User? user = GetUserByExternalIdAsync(userDto.ExternalIdentityId);

            if (user == null)
            {
                user = new User
                {
                    ExternalIdentityId = userDto.ExternalIdentityId,
                    FirstName = userDto.FirstName,
                    LastName = userDto.LastName,
                    Email = userDto.Email
                };

                await Repository.AddAsync(user);
            }
            else
            {
                user.FirstName = userDto.FirstName;
                user.LastName = userDto.LastName;
                user.Email = userDto.Email;
            }

            await Repository.SaveChangesAsync();
        }

        public Task DeleteUserAsync(string userId)
        {
            throw new NotImplementedException();
        }

        public User? GetUserByExternalIdAsync(string externalIdentityId)
        {
            return Repository
                .All<User>()
                .FirstOrDefault(u => u.ExternalIdentityId == externalIdentityId);
        }

        public Task UpdateUserAsync(UserDto userDto)
        {
            throw new NotImplementedException();
        }
    }
}

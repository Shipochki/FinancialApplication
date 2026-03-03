namespace FinancialApplication.Application.Services.UserService
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
            User? userResult = GetUserByExternalIdAsync(userDto.ExternalIdentityId);

            if(userResult != null)
            {
                throw new ArgumentException($"User with external id {userDto.ExternalIdentityId} already exist!");
            }

            User user = new User
            {
                ExternalIdentityId = userDto.ExternalIdentityId,
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Email = userDto.Email
            };

            await Repository.AddAsync(user);
            await Repository.SaveChangesAsync();
        }

        public Task DeleteUserAsync(string userId)
        {
            throw new NotImplementedException();
        }

        public User GetUserByExternalIdAsync(string externalIdentityId)
        {
            User? existingUser = Repository.All<User>()
                .FirstOrDefault(u => u.ExternalIdentityId == externalIdentityId);

            if(externalIdentityId == null)
            {
                throw new ArgumentNullException($"User with external identity id {externalIdentityId} is not exists.");
            }

            return existingUser;
        }

        public Task UpdateUserAsync(UserDto userDto)
        {
            throw new NotImplementedException();
        }
    }
}

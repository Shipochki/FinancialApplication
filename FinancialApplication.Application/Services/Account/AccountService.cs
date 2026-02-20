namespace FinancialApplication.Application.Services.Account
{
    using FinancialApplication.Application.Common.Interfaces.Repository;
    using FinancialApplication.Domain.Entities;
    using FinancialApplication.Domain.Enums;

    public class AccountService : BaseService, IAccountService
    {
        public AccountService(IRepository repository): base(repository)
        {
        }

        public async Task CreateAccountAsync(AccountDto request)
        {
            User? owner = Repository.GetByIdAsync<User>(Guid.Parse(request.OwnerId)).Result;
            if (owner == null)
            {
                throw new Exception("Owner not found");
            }

            Account account = new Account
            {
                Name = request.Name,
                Balance = request.Balance,
                Description = request.Description,
                Currency = (Currency)request.Currency,
                OwnerId = owner.Id,
                Owner = owner,
                CreatedOn = DateTime.UtcNow
            };

            await Repository.AddAsync(account);
            await Repository.SaveChangesAsync();
        }

        public Task DeleteAccountAsync(string accountId)
        {
            throw new NotImplementedException();
        }

        public Task<AccountDto> GetAccountByIdAsync(string accountId)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<AccountDto>> GetAccountsByOwnerIdAsync(string ownerId)
        {
            throw new NotImplementedException();
        }

        public Task UpdateAccountAsync(AccountDto request)
        {
            throw new NotImplementedException();
        }
    }
}

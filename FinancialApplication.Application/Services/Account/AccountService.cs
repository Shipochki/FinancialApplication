namespace FinancialApplication.Application.Services.Account
{
    using FinancialApplication.Application.Common.Interfaces.Repository;
    using FinancialApplication.Domain.Entities;

    public class AccountService : BaseService, IAccountService
    {
        public AccountService(IRepository repository) : base(repository)
        {
        }

        public Task CreateAccountAsync(AccountDto request)
        {
            throw new NotImplementedException();
        }

        public Task DeleteAccountAsync(Guid accountId)
        {
            throw new NotImplementedException();
        }

        public Task<AccountDto> GetAccountByIdAsync(Guid accountId)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<AccountDto>> GetAccountsByOwnerIdAsync(Guid ownerId)
        {
            throw new NotImplementedException();
        }

        public Task UpdateAccountAsync(Guid accountId, AccountDto request)
        {
            throw new NotImplementedException();
        }
    }
}

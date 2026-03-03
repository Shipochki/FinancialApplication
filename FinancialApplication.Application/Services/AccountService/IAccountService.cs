namespace FinancialApplication.Application.Services.AccountService
{
    public interface IAccountService
    {
        Task CreateAccountAsync(AccountDto request);
        Task<AccountDto> GetAccountByIdAsync(string accountId);
        IEnumerable<AccountDto> GetAccountsByOwnerId(string ownerId);
        Task UpdateAccountAsync(AccountDto request);
        Task DeleteAccountAsync(string accountId);
    }
}

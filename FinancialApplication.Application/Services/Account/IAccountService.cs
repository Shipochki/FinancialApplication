namespace FinancialApplication.Application.Services.Account
{
    public interface IAccountService
    {
        Task CreateAccountAsync(AccountDto request);
        Task<AccountDto> GetAccountByIdAsync(string accountId);
        Task<IEnumerable<AccountDto>> GetAccountsByOwnerIdAsync(string ownerId);
        Task UpdateAccountAsync(AccountDto request);
        Task DeleteAccountAsync(string accountId);
    }
}

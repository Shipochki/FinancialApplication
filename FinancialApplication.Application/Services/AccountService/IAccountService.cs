namespace FinancialApplication.Application.Services.AccountService
{
    public interface IAccountService
    {
        Task CreateAccountAsync(AccountDto request);
        Task<AccountDto> GetAccountByIdAsync(string accountId, string externalUserId);
        IEnumerable<AccountDto> GetAccountsByOwnerId(string ownerId);
        Task UpdateAccountAsync(AccountDto request, string externalUserId);
        Task DeleteAccountAsync(string accountId, string externalUserId);
    }
}

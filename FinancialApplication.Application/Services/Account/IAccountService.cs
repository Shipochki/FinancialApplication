namespace FinancialApplication.Application.Services.Account
{
    public interface IAccountService
    {
        Task CreateAccountAsync(AccountDto request);
        Task<AccountDto> GetAccountByIdAsync(Guid accountId);
        Task<IEnumerable<AccountDto>> GetAccountsByOwnerIdAsync(Guid ownerId);
        Task UpdateAccountAsync(Guid accountId, AccountDto request);
        Task DeleteAccountAsync(Guid accountId);
    }
}

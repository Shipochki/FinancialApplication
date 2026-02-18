namespace FinancialApplication.Application.Services.Account
{
    using FinancialApplication.Domain.Entities;

    public class AccountDto : BaseDto
    {
        public required string Name { get; set; }
        public decimal Balance { get; set; }
        public string? Description { get; set; }
        public int Currency { get; set; }
        public required string OwnerId { get; set; }

        public AccountDto AccountToAccountDto(Account account)
        {
            return new AccountDto
            {
                Id = account.Id.ToString(),
                Name = account.Name,
                Balance = account.Balance,
                Description = account.Description,
                Currency = (int)account.Currency,
                OwnerId = account.OwnerId.ToString()
            };
        }
    }
}

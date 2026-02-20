namespace FinancialApplication.Application.Services.Transaction
{
    using FinancialApplication.Domain.Entities;

    public class TransactionDto : BaseDto
    {
        public int Type { get; set; }
        public required decimal Amount { get; set; }
        public required DateTime Date { get; set; }
        public string? Description { get; set; }
        public required string CategoryId { get; set; }
        public required string AccountId { get; set; }

        public static TransactionDto TransactionToTransactionDto(Transaction transaction)
        {
            return new TransactionDto
            {
                Id = transaction.Id.ToString(),
                Type = (int)transaction.Type,
                Amount = transaction.Amount,
                Date = transaction.Date,
                Description = transaction.Description,
                CategoryId = transaction.CategoryId.ToString(),
                AccountId = transaction.AccountId.ToString(),
            };
        }
    }
}

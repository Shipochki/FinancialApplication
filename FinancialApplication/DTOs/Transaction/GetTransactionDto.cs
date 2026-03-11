namespace FinancialApplication.Api.DTOs.Transaction
{
    public class GetTransactionDto
    {
        public string Id { get; set; } = null!;
        public int Type { get; set; }
        public required decimal Amount { get; set; }
        public required string Date { get; set; }
        public string? Description { get; set; }
        public required string CategoryId { get; set; }
        public required string AccountId { get; set; }
    }
}

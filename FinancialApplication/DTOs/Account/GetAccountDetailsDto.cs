namespace FinancialApplication.Api.DTOs.Account
{
    using FinancialApplication.Api.DTOs.Transaction;

    public class GetAccountDetailsDto
    {
        public required string Id { get; set; }
        public required string Name { get; set; }
        public decimal Balance { get; set; }
        public string? Description { get; set; }
        public int Currency { get; set; }
        public required string OwnerId { get; set; }
        public List<GetTransactionDto> TransactionDtos { get; set; } = new List<GetTransactionDto>();
    }
}

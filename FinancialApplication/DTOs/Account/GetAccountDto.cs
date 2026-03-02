namespace FinancialApplication.Api.DTOs.Account
{
    public class GetAccountDto
    {
        public required string Id { get; set; }
        public required string Name { get; set; }
        public decimal Balance { get; set; }
        public string? Description { get; set; }
        public int Currency { get; set; }
        public required string OwnerId { get; set; }
    }
}

namespace FinancialApplication.Api.DTOs.Transaction
{
	using FinancialApplication.Api.DTOs.Category;

	public class GetTransactionDetailsDto
	{
		public string Id { get; set; } = null!;
		public int Type { get; set; }
		public required decimal Amount { get; set; }
		public required string Date { get; set; }
		public string? Description { get; set; }
		public required string AccountId { get; set; }
		public GetCategoryDto Category { get; set; } = null!;
	}
}

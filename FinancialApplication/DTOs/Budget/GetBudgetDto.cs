using FinancialApplication.Api.DTOs.Category;

namespace FinancialApplication.Api.DTOs.Budget
{
	public class GetBudgetDto
	{
		public required string Id { get; set; }
		public required string Name { get; set; }
		public decimal Amount { get; set; }
		public string? Description { get; set; }
		public required string StartDate { get; set; }
		public required string EndDate { get; set; }
		public int Type { get; set; }
		public required string CategoryId { get; set; }
		public GetCategoryDto Category { get; set; } = null!;
		public required string AccountId { get; set; }
	}
}

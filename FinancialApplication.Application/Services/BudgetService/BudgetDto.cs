namespace FinancialApplication.Application.Services.BudgetService
{
	using FinancialApplication.Domain.Enums;

	public class BudgetDto : BaseDto
	{
		public required string Name { get; set; }
		public decimal Amount { get; set; }
		public string? Description { get; set; }
		public DateTime StartDate { get; set; }
		public DateTime EndDate { get; set; }
		public TypeBudget Type { get; set; }
		public required string CategoryId { get; set; }
		public required string AccountId { get; set; }
	}
}

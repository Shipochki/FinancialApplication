namespace FinancialApplication.Api.DTOs.Budget
{
	using System.ComponentModel.DataAnnotations;
	using static FinancialApplication.Domain.Common.DataConstants.Budget;

	public class UpdateBudgetDto
	{
		public required string Id { get; set; }
		[MaxLength(MaxLengthName)]
		public required string Name { get; set; }
		public decimal Amount { get; set; }
		[MaxLength(MaxLengthDescription)]
		public string? Description { get; set; }
		public required string StartDate { get; set; }
		public required string EndDate { get; set; }
		[Range(MinRangeType, MaxRangeType)]
		public int Type { get; set; }
		public required string CategoryId { get; set; }
		public required string AccountId { get; set; }
	}
}

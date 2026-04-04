namespace FinancialApplication.Application.Services.BudgetService
{
	using FinancialApplication.Domain.Entities;
	using FinancialApplication.Domain.Enums;

	public class BudgetDto : BaseDto
	{
		public required string Name { get; set; }
		public decimal Amount { get; set; }
		public string? Description { get; set; }
		public DateTime StartDate { get; set; }
		public DateTime EndDate { get; set; }
		public int Type { get; set; }
		public required string CategoryId { get; set; }
		public required string AccountId { get; set; }

		public static BudgetDto BudgetToBudgetDto(Budget budget)
		{
			return new BudgetDto()
			{
				Id = budget.Id.ToString(),
				Name = budget.Name,
				Amount = budget.Amount,
				Description = budget.Description,
				StartDate = budget.StartDate,
				EndDate = budget.EndDate,
				Type = (int)budget.Type,
				AccountId = budget.AccountId.ToString(),
				CategoryId = budget.CategoryId.ToString(),
			};
		}
	}
}

namespace FinancialApplication.Application.Services.BudgetService
{
	public interface IBudgetService
	{
		Task CreateBudgetAsync(BudgetDto budgetDto);

		Task UpdateBudgetAsync(BudgetDto budgetDto);

		Task DeleteBudgetAsync(string budgetId);

		List<BudgetDto> GetAllBudgetsByAccountId(string accountId);

		Task<BudgetDto> GetBudgetByIdAsync(string budgetId);
	}
}

namespace FinancialApplication.Application.Services.BudgetService
{
	using FinancialApplication.Application.Common.Interfaces.Repository;
	using FinancialApplication.Domain.Entities;

	public class BudgetService : BaseService, IBudgetService
	{
		public BudgetService(IRepository repository)
			: base(repository)
		{
		}

		public async Task CreateBudgetAsync(BudgetDto budgetDto)
		{
			Account? account = await Repository.GetByIdAsync<Account>(budgetDto.AccountId);

			if (account == null)
			{
				throw new ArgumentNullException($"In Service:{nameof(BudgetService)}, Method: {nameof(CreateBudgetAsync)}, Cannot find {nameof(Account)} with id {budgetDto.AccountId}");
			}

			Category? category = await Repository.GetByIdAsync<Category>(budgetDto.CategoryId);

			if (category == null)
			{
				throw new ArgumentNullException($"In Service:{nameof(BudgetService)}, Method: {nameof(CreateBudgetAsync)}, Cannot find {nameof(Category)} with id {budgetDto.CategoryId}");
			}

			Budget budget = new Budget()
			{
				Name = budgetDto.Name,
				Amount = budgetDto.Amount,
				Description = budgetDto.Description,
				StartDate = budgetDto.StartDate,
				EndDate = budgetDto.EndDate,
				Type = budgetDto.Type,
				AccountId = Guid.Parse(budgetDto.AccountId),
				Account = account,
				CategoryId = Guid.Parse(budgetDto.CategoryId),
				Category = category,
				CreatedOn = DateTime.UtcNow,
			};

			await Repository.AddAsync(budget);
			await Repository.SaveChangesAsync();
		}

		public async Task DeleteBudgetAsync(string budgetId)
		{
			Budget? budget = await Repository.GetByIdAsync<Budget>(budgetId);

			if (budget == null)
			{
				throw new ArgumentNullException($"In Service:{nameof(BudgetService)}, Method: {nameof(DeleteBudgetAsync)}, Cannot find {nameof(Budget)} with id {budgetId}");
			}

			budget.IsDeleted = true;
			await Repository.SaveChangesAsync();
		}

		public List<BudgetDto> GetAllBudgetsByAccountId(string accountId)
		{
			return Repository.All<Budget>(b => b.AccountId == Guid.Parse(accountId) && !b.IsDeleted)
				.Select(b => new BudgetDto
				{
					Id = b.Id.ToString(),
					Name = b.Name,
					Amount = b.Amount,
					Description = b.Description,
					StartDate = b.StartDate,
					EndDate = b.EndDate,
					Type = b.Type,
					AccountId = b.AccountId.ToString(),
					CategoryId = b.CategoryId.ToString(),
				})
				.ToList();
		}

		public async Task<BudgetDto> GetBudgetByIdAsync(string budgetId)
		{
			Budget? budget = await Repository.GetByIdAsync<Budget>(budgetId);

			if (budget == null)
			{
				throw new ArgumentNullException($"In Service:{nameof(BudgetService)}, Method: {nameof(GetBudgetByIdAsync)}, Cannot find {nameof(Budget)} with id {budgetId}");
			}

			return new BudgetDto
			{
				Id = budget.Id.ToString(),
				Name = budget.Name,
				Amount = budget.Amount,
				Description = budget.Description,
				StartDate = budget.StartDate,
				EndDate = budget.EndDate,
				Type = budget.Type,
				AccountId = budget.AccountId.ToString(),
				CategoryId = budget.CategoryId.ToString(),
			};
		}

		public async Task UpdateBudgetAsync(BudgetDto budgetDto)
		{
			Budget? budget = await Repository.GetByIdAsync<Budget>(budgetDto.Id);

			if (budget == null)
			{
				throw new ArgumentNullException($"In Service:{nameof(BudgetService)}, Method: {nameof(UpdateBudgetAsync)}, Cannot find {nameof(Budget)} with id {budgetDto.Id}");
			}

			Account? account = await Repository.GetByIdAsync<Account>(budgetDto.AccountId);

			if (account == null)
			{
				throw new ArgumentNullException($"In Service:{nameof(BudgetService)}, Method: {nameof(UpdateBudgetAsync)}, Cannot find {nameof(Account)} with id {budgetDto.AccountId}");
			}

			Category? category = await Repository.GetByIdAsync<Category>(budgetDto.CategoryId);

			if (category == null)
			{
				throw new ArgumentNullException($"In Service:{nameof(BudgetService)}, Method: {nameof(UpdateBudgetAsync)}, Cannot find {nameof(Category)} with id {budgetDto.CategoryId}");
			}

			budget.Name = budgetDto.Name;
			budget.Amount = budgetDto.Amount;
			budget.Description = budgetDto.Description;
			budget.StartDate = budgetDto.StartDate;
			budget.EndDate = budgetDto.EndDate;
			budget.Type = budgetDto.Type;

			await Repository.SaveChangesAsync();
		}
	}
}

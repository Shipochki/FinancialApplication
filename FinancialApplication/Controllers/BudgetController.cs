namespace FinancialApplication.Api.Controllers
{
	using FinancialApplication.Api.DTOs.Budget;
	using FinancialApplication.Api.DTOs.Category;
	using FinancialApplication.Application.Services.AccountService;
	using FinancialApplication.Application.Services.BudgetService;
	using FinancialApplication.Application.Services.CategoryService;
	using FinancialApplication.Application.Services.TransactionService;
	using FinancialApplication.Application.Services.UserService;
	using Microsoft.AspNetCore.Authorization;
	using Microsoft.AspNetCore.Mvc;
	using System.ComponentModel.DataAnnotations;

	[Authorize(Policy = "RequireApiScope")]
	[ApiController]
	[Route("api/[controller]")]
	public class BudgetController : BaseController
	{
		public BudgetController(
			IAccountService accountService
			, IUserService userService
			, ITransactionService transactionService
			, ICategoryService categoryService
			, IBudgetService budgetService)
			: base(accountService, userService, transactionService, categoryService, budgetService)
		{
		}

		[HttpPost]
		[Route("[action]")]
		public async Task<IActionResult> CreateBudget([FromBody] CreateBudgetDto request)
		{
			Validator.ValidateObject(request, new ValidationContext(request), true);
			await BudgetService.CreateBudgetAsync(new BudgetDto()
			{
				Name = request.Name,
				Amount = request.Amount,
				Description = request.Description,
				StartDate = DateTime.Parse(request.StartDate),
				EndDate = DateTime.Parse(request.EndDate),
				Type = request.Type,
				AccountId = request.AccountId,
				CategoryId = request.CategoryId
			});
			return Created();
		}

		[HttpPut]
		[Route("[action]")]
		public async Task<IActionResult> UpdateBudget([FromBody] UpdateBudgetDto request)
		{
			Validator.ValidateObject(request, new ValidationContext(request), true);
			await BudgetService.UpdateBudgetAsync(new BudgetDto()
			{
				Id = request.Id,
				Name = request.Name,
				Amount = request.Amount,
				Description = request.Description,
				StartDate = DateTime.Parse(request.StartDate),
				EndDate = DateTime.Parse(request.EndDate),
				Type = request.Type,
				AccountId = request.AccountId,
				CategoryId = request.CategoryId
			});
			return NoContent();
		}

		[HttpDelete]
		[Route("[action]/{budgetId}")]
		public async Task<IActionResult> DeleteBudget(string budgetId)
		{
			await BudgetService.DeleteBudgetAsync(budgetId);
			return NoContent();
		}

		[HttpGet]
		[Route("[action]/{accountId}")]
		public async Task<List<GetBudgetDto>> GetAllBudgetsByAccountId(string accountId)
		{
			List<GetBudgetDto> budgets = BudgetService.GetAllBudgetsByAccountId(accountId)
				.Select(b => new GetBudgetDto()
				{
					Id = b.Id,
					Name = b.Name,
					Amount = b.Amount,
					Description = b.Description,
					StartDate = b.StartDate.ToString("yyyy-MM-dd"),
					EndDate = b.EndDate.ToString("yyyy-MM-dd"),
					Type = b.Type,
					CategoryId = b.CategoryId,
					AccountId = b.AccountId,
				})
				.ToList();

			foreach (var budget in budgets)
			{
				CategoryDto category = await CategoryService.GetCategoryByIdAsync(budget.CategoryId, this.User.GetUserId());
				budget.Category = new GetCategoryDto()
				{
					Id = category.Id,
					Name = category.Name,
					Description = category.Description,
					Icon = category.Icon,
					IsGlobal = category.IsGlobal,
				};
			}

			return budgets;
		}

		[HttpGet]
		[Route("[action]/{budgetId}")]
		public async Task<GetBudgetDto> GetBudgetById(string budgetId)
		{
			BudgetDto budget = await BudgetService.GetBudgetByIdAsync(budgetId);
			CategoryDto category = await CategoryService.GetCategoryByIdAsync(budget.CategoryId, this.User.GetUserId());

			return new GetBudgetDto()
			{
				Id = budget.Id,
				Name = budget.Name,
				Amount = budget.Amount,
				Description = budget.Description,
				StartDate = budget.StartDate.ToString("yyyy-MM-dd"),
				EndDate = budget.EndDate.ToString("yyyy-MM-dd"),
				Type = budget.Type,
				CategoryId = budget.CategoryId,
				AccountId = budget.AccountId,
				Category = new GetCategoryDto()
				{
					Id = category.Id,
					Description = category.Description,
					Icon = category.Icon,
					IsGlobal = category.IsGlobal,
					Name = category.Name
				}
			};
		}
	}
}

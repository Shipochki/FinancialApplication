using FinancialApplication.Application.Services.AccountService;
using FinancialApplication.Application.Services.BudgetService;
using FinancialApplication.Application.Services.CategoryService;
using FinancialApplication.Application.Services.TransactionService;
using FinancialApplication.Application.Services.UserService;
using Microsoft.AspNetCore.Mvc;

namespace FinancialApplication.Api.Controllers
{
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
	}
}

namespace FinancialApplication.Api.Controllers
{
    using FinancialApplication.Application.Services.AccountService;
	using FinancialApplication.Application.Services.BudgetService;
	using FinancialApplication.Application.Services.CategoryService;
	using FinancialApplication.Application.Services.TransactionService;
    using FinancialApplication.Application.Services.UserService;
    using Microsoft.AspNetCore.Mvc;

    public abstract class BaseController : Controller
    {
        protected readonly IAccountService AccountService;
        protected readonly IUserService UserService;
        protected readonly ITransactionService TransactionService;
        protected readonly ICategoryService CategoryService;
        protected readonly IBudgetService budgetService;

		public BaseController(IAccountService accountService
            , IUserService userService
            , ITransactionService transactionService
            , ICategoryService categoryService
            , IBudgetService budgetService)
        {
            AccountService = accountService;
            UserService = userService;
            TransactionService = transactionService;
            CategoryService = categoryService;
            BudgetService = budgetService;
		}
    }
}

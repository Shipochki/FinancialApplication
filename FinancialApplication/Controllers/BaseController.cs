namespace FinancialApplication.Api.Controllers
{
    using FinancialApplication.Application.Services.Account;
    using FinancialApplication.Application.Services.Transaction;
    using FinancialApplication.Application.Services.User;
    using Microsoft.AspNetCore.Mvc;

    public abstract class BaseController : Controller
    {
        protected readonly IAccountService AccountService;
        protected readonly IUserService UserService;
        protected readonly ITransactionService TransactionService;

        protected BaseController(IAccountService accountService
            , IUserService userService
            , ITransactionService transactionService)
        {
            AccountService = accountService;
            UserService = userService;
            TransactionService = transactionService;
        }
    }
}

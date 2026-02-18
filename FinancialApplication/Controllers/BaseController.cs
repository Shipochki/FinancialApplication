namespace FinancialApplication.Api.Controllers
{
    using FinancialApplication.Application.Services.Account;
    using FinancialApplication.Application.Services.User;
    using Microsoft.AspNetCore.Mvc;

    public abstract class BaseController : Controller
    {
        protected readonly IAccountService AccountService;
        protected readonly IUserService UserService;

        protected BaseController(IAccountService accountService
            , IUserService userService)
        {
            AccountService = accountService;
            UserService = userService;
        }
    }
}

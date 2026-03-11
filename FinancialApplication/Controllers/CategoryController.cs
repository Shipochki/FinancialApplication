namespace FinancialApplication.Api.Controllers
{
    using FinancialApplication.Application.Services.AccountService;
    using FinancialApplication.Application.Services.TransactionService;
    using FinancialApplication.Application.Services.UserService;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;

    [Authorize(Policy = "RequireApiScope")]
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : BaseController
    {
        public CategoryController(IAccountService accountService
            , IUserService userService
            , ITransactionService transactionService)
            : base(accountService, userService, transactionService)
        {
        }
    }
}

namespace FinancialApplication.Api.Controllers
{
    using FinancialApplication.Api.DTOs.Transaction;
    using FinancialApplication.Application.Services.AccountService;
	using FinancialApplication.Application.Services.CategoryService;
	using FinancialApplication.Application.Services.TransactionService;
    using FinancialApplication.Application.Services.UserService;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using System.ComponentModel.DataAnnotations;

    [Authorize(Policy = "RequireApiScope")]
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionController : BaseController
    {
        public TransactionController(IAccountService accountService
            , IUserService userService
            , ITransactionService transactionService
            , ICategoryService categoryService)
            : base(accountService, userService, transactionService, categoryService)
        {
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> CreateTransaction([FromBody] CreateTransactionDto request)
        {
            Validator.ValidateObject(request, new ValidationContext(request), true);

            await TransactionService.CreateTransactionAsync(new TransactionDto()
            {
                Type = request.Type,
                Amount = request.Amount,
                Date = DateTime.Parse(request.Date),
                Description = request.Description,
                CategoryId = request.CategoryId,
                AccountId = request.AccountId
            });

            return Created();
        }
    }
}

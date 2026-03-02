namespace FinancialApplication.Api.Controllers
{
    using FinancialApplication.Api.DTOs.Transaction;
    using FinancialApplication.Application.Services.Account;
    using FinancialApplication.Application.Services.Transaction;
    using FinancialApplication.Application.Services.User;
    using Microsoft.AspNetCore.Mvc;
    using System.ComponentModel.DataAnnotations;

    [ApiController]
    [Route("api/[controller]")]
    public class TransactionController : BaseController
    {
        public TransactionController(IAccountService accountService
            , IUserService userService
            , ITransactionService transactionService)
            : base(accountService, userService, transactionService)
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

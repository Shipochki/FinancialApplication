using FinancialApplication.Application.Services.Account;
using FinancialApplication.Application.Services.Transaction;
using FinancialApplication.Application.Services.User;
using Microsoft.AspNetCore.Mvc;

namespace FinancialApplication.Api.Controllers
{
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
        public async Task<IActionResult> CreateTransaction([FromBody] TransactionDto transactionDto)
        {
            await TransactionService.CreateTransactionAsync(transactionDto);
            return Ok();
        }
    }
}

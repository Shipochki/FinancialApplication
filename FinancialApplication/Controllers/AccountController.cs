namespace FinancialApplication.Api.Controllers
{
    using FinancialApplication.Api.DTOs.Account;
    using FinancialApplication.Application.Services.Account;
    using FinancialApplication.Application.Services.Transaction;
    using FinancialApplication.Application.Services.User;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using System.ComponentModel.DataAnnotations;
    using static ClaimsPrincipalExtensions;

    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : BaseController
    {
        public AccountController(IAccountService accountService
            , IUserService userService
            , ITransactionService transactionService)
            : base(accountService, userService, transactionService)
        {
        }
        
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> CreateAccount([FromBody] CreateAccountDto request)
        {
            Validator.ValidateObject(request, new ValidationContext(request), true);

            await AccountService.CreateAccountAsync(new AccountDto 
            { 
                Balance = request.Balance,
                Currency = request.Currency,
                Description = request.Description,
                Name = request.Name,
                OwnerId = request.OwnerId
            });

            return Created();
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<List<GetAccountDto>> GetAll()
        {
            List<AccountDto> accounts = AccountService.GetAccountsByOwnerId(User.GetUserId()).ToList();
            return accounts.Select(AccountDto => new GetAccountDto
            {
                Id = AccountDto.Id,
                Name = AccountDto.Name,
                Balance = AccountDto.Balance,
                Description = AccountDto.Description,
                Currency = AccountDto.Currency,
                OwnerId = AccountDto.OwnerId
            }).ToList();
        }
    }
}

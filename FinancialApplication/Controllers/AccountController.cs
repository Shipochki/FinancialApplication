namespace FinancialApplication.Api.Controllers
{
    using FinancialApplication.Api.DTOs.Account;
    using FinancialApplication.Api.DTOs.Transaction;
    using FinancialApplication.Application.Services.AccountService;
    using FinancialApplication.Application.Services.TransactionService;
    using FinancialApplication.Application.Services.UserService;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using System.ComponentModel.DataAnnotations;
    using static ClaimsPrincipalExtensions;

    [Authorize(Policy = "RequireApiScope")]
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
                OwnerId = User.GetUserId()
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

        [HttpGet]
        [Route("[action]/{accountId}")]
        public async Task<GetAccountDetailsDto> GetAccountDetails(string accountId, [FromQuery] int transactionLimit = 3)
        {
            if(string.IsNullOrWhiteSpace(accountId))
            {
                throw new ArgumentException("Account ID cannot be null or empty.", nameof(accountId));
            }

            AccountDto account =  await AccountService.GetAccountByIdAsync(accountId);
            List<TransactionDto> transactions = await TransactionService.GetTopTransactionsByAccountId(accountId, transactionLimit);

            GetAccountDetailsDto accountDetailsDto = new GetAccountDetailsDto
            {
                Id = account.Id,
                Name = account.Name,
                Balance = account.Balance,
                Description = account.Description,
                Currency = account.Currency,
                OwnerId = account.OwnerId,
                TransactionDtos = transactions.Select(transaction => new GetTransactionDto
                {
                    Id = transaction.Id,
                    Type = transaction.Type,
                    Amount = transaction.Amount,
                    Date = transaction.Date.ToString(),
                    Description = transaction.Description,
                    CategoryId = transaction.CategoryId,
                    AccountId = transaction.AccountId
                }).ToList()
            };

            return accountDetailsDto;
        }
    }
}

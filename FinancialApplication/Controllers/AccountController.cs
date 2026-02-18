namespace FinancialApplication.Api.Controllers
{
    using FinancialApplication.Api.DTOs.Account;
    using FinancialApplication.Application.Services.Account;
    using FinancialApplication.Application.Services.User;
    using Microsoft.AspNetCore.Mvc;
    using System.ComponentModel.DataAnnotations;

    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : BaseController
    {
        public AccountController(IAccountService accountService
            , IUserService userService)
            : base(accountService, userService)
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

            return Ok();
        }
    }
}

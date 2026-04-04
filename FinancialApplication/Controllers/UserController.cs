namespace FinancialApplication.Api.Controllers
{
    using FinancialApplication.Api.DTOs.User;
    using FinancialApplication.Application.Services.AccountService;
	using FinancialApplication.Application.Services.BudgetService;
	using FinancialApplication.Application.Services.CategoryService;
	using FinancialApplication.Application.Services.TransactionService;
    using FinancialApplication.Application.Services.UserService;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using System.ComponentModel.DataAnnotations;
    using System.Security.Claims;

    [Authorize(Policy = "RequireApiScope")]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : BaseController
    {
        public UserController(IAccountService accountService
            , IUserService userService
            , ITransactionService transactionService
            , ICategoryService categoryService
            , IBudgetService budgetService)
            : base(accountService, userService, transactionService, categoryService, budgetService)
        {
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> SyncUser()
        {
            CreateUserDto createUserDto = new CreateUserDto
            {
                ExternalIdentityId = User.FindFirstValue(ClaimTypes.NameIdentifier),
                FirstName = User.FindFirstValue(ClaimTypes.GivenName),
                LastName = User.FindFirstValue(ClaimTypes.Surname),
                Email = User.FindFirstValue(ClaimTypes.Email)
            };

            Validator.ValidateObject(createUserDto, new ValidationContext(createUserDto), validateAllProperties: true);

            await UserService.SyncUserAsync(new UserDto()
            {
                ExternalIdentityId = createUserDto.ExternalIdentityId,
                FirstName = createUserDto.FirstName,
                LastName = createUserDto.LastName,
                Email = createUserDto.Email
            });

            return Ok();
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteUser()
        {
            string? externalIdentityId = User.GetUserId();

            if(externalIdentityId == null)
            {
                return BadRequest("External Identity Id is required.");
            }

            await UserService.DeleteUserAsync(externalIdentityId);
            return Ok();
        }
    }
}

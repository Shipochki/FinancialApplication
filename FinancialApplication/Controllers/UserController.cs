using FinancialApplication.Api.DTOs.User;
using FinancialApplication.Application.Services.Account;
using FinancialApplication.Application.Services.User;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace FinancialApplication.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : BaseController
    {
        public UserController(IAccountService accountService
            , IUserService userService)
            : base(accountService, userService)
        {
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto request)
        {
            Validator.ValidateObject(request, new ValidationContext(request), true);


            await UserService.CreateUserAsync(new UserDto
            {
                ExternalIdentityId = request.ExternalIdentityId,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email
            });
            return Ok();
        }
    }
}

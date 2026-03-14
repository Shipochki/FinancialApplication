namespace FinancialApplication.Api.Controllers
{
	using FinancialApplication.Api.DTOs.Category;
	using FinancialApplication.Application.Services.AccountService;
	using FinancialApplication.Application.Services.CategoryService;
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
            , ITransactionService transactionService
            , ICategoryService categoryService)
            : base(accountService, userService, transactionService, categoryService)
        {
        }

        [HttpGet]
		[Route("[action]")]
        public List<GetCategoryDto> GetAllCategories()
        {
            List<GetCategoryDto> result = CategoryService
                .GetAllCategories(this.User.GetUserId())
                .Select(c => new GetCategoryDto()
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    Icon = c.Icon,
                })
                .ToList();

            return result;
        }
	}
}

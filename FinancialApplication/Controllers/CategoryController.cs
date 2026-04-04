namespace FinancialApplication.Api.Controllers
{
	using FinancialApplication.Api.DTOs.Category;
	using FinancialApplication.Application.Services.AccountService;
	using FinancialApplication.Application.Services.BudgetService;
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
            , ICategoryService categoryService
            , IBudgetService budgetService)
            : base(accountService, userService, transactionService, categoryService, budgetService)
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
                    IsGlobal = c.IsGlobal
				})
                .ToList();

            return result;
        }

        [HttpDelete]
        [Route("[action]/{categoryId}")]
        public async Task<IActionResult> DeleteCategory(string categoryId)
        {
            await CategoryService.DeleteCategoryAsync(categoryId, this.User.GetUserId());
            return NoContent();
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryDto request)
        {
            await CategoryService.CreateCategoryByUserAsync(new CategoryDto
            {
                Name = request.Name,
                Description = request.Description,
                Icon = request.Icon
            }, this.User.GetUserId());
            return Created();
        }

        [HttpPut]
        [Route("[action]")]
        public async Task<IActionResult> UpdateCategory([FromBody] UpdateCategoryDto request)
        {
            await CategoryService.UpdateCategoryAsync(new CategoryDto
            {
                Id = request.Id,
                Name = request.Name,
                Description = request.Description,
                Icon = request.Icon
            }, this.User.GetUserId());
            return NoContent();
        }
    }
}

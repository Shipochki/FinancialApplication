using FinancialApplication.Application.Common.Interfaces.Repository;
using FinancialApplication.Application.Services.UserService;
using FinancialApplication.Domain.Entities;

namespace FinancialApplication.Application.Services.CategoryService
{
	public class CategoryService : BaseService, ICategoryService
	{
		private readonly IUserService _userService;

		public CategoryService(IRepository repository
			, IUserService userService)
			: base(repository)
		{
			_userService = userService;
		}

		public Task CreateCategoryAsync(CategoryDto category)
		{
			throw new NotImplementedException();
		}

		public List<CategoryDto> GetAllCategories(string userExternalId)
		{
			User? user = _userService.GetUserByExternalIdAsync(userExternalId);

			return Repository
				.All<Category>()
				.Where(c => c.IsGlobal || c.OwnerId == user.Id)
				.Select(c => CategoryDto.CategoryDtoToCategory(c))
				.ToList();
		}

		public async Task<CategoryDto> GetCategoryByIdAsync(string categoryId, string userExternalId)
		{
			User? user = _userService.GetUserByExternalIdAsync(userExternalId);

			Category? category = await Repository
				.FirstOrDefaultAsync<Category>(c => c.Id == Guid.Parse(categoryId));

			if(category.Owner != null && category.OwnerId != user.Id)
			{
				throw new ArgumentException($"User id: {user.Id} is not the owner of category: {category.Id}");
			}

			if(category == null)
			{
				throw new ArgumentNullException($"Service: {nameof(CategoryService)}, Method: {nameof(GetCategoryByIdAsync)} Category with id: {categoryId} is missing");
			}

			return CategoryDto.CategoryDtoToCategory(category);
		}
	}
}

namespace FinancialApplication.Application.Services.CategoryService
{
	public interface ICategoryService
	{
		Task CreateCategoryAsync(CategoryDto category);

		List<CategoryDto> GetAllCategories(string userExternalId);

		Task<CategoryDto> GetCategoryByIdAsync(string categoryId, string userExternalId);
	}
}

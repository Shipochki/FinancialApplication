namespace FinancialApplication.Application.Services.CategoryService
{
	public interface ICategoryService
	{
		Task CreateCategoryByUserAsync(CategoryDto category, string userExternalId);

		List<CategoryDto> GetAllCategories(string userExternalId);

		Task<CategoryDto> GetCategoryByIdAsync(string categoryId, string userExternalId);

		Task UpdateCategoryAsync(CategoryDto category, string userExternalId);

		Task DeleteCategoryAsync(string categoryId, string userExternalId);
	}
}

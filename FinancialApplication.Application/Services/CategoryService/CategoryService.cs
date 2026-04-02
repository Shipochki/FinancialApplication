namespace FinancialApplication.Application.Services.CategoryService
{
	using FinancialApplication.Application.Common.Interfaces.Repository;
	using FinancialApplication.Application.Services.UserService;
	using FinancialApplication.Domain.Entities;

	public class CategoryService : BaseService, ICategoryService
	{
		private readonly IUserService _userService;

		public CategoryService(IRepository repository
			, IUserService userService)
			: base(repository)
		{
			_userService = userService;
		}

		public async Task CreateCategoryByUserAsync(CategoryDto category, string userExternalId)
		{
			User? user = _userService.GetUserByExternalId(userExternalId);

			if (user == null)
			{
				throw new ArgumentNullException($"Service: {nameof(CategoryService)}, Method: {nameof(CreateCategoryByUserAsync)} User with external id: {userExternalId} is missing");
			}

			Category categoryToCreate = new Category
			{
				Name = category.Name,
				Description = category.Description,
				Icon = category.Icon,
				IsGlobal = false,
				OwnerId = user.Id,
				Owner = user,
				CreatedOn = DateTime.UtcNow
			};

			await Repository.AddAsync(categoryToCreate);
			await Repository.SaveChangesAsync();
		}

		public async Task DeleteCategoryAsync(string categoryId, string userExternalId)
		{
			Category? category = await GetCategoryById(categoryId);

			await IsUserTheOwner(category, userExternalId);

			category.IsDeleted = true;
			await Repository.SaveChangesAsync();
		}

		public List<CategoryDto> GetAllCategories(string userExternalId)
		{
			User? user = _userService.GetUserByExternalId(userExternalId);

			return Repository
				.All<Category>()
				.Where(c => (c.IsGlobal || c.OwnerId == user.Id) && c.IsDeleted == false)
				.Select(c => CategoryDto.CategoryDtoToCategory(c))
				.ToList();
		}

		public async Task<CategoryDto> GetCategoryByIdAsync(string categoryId, string userExternalId)
		{
			Category? category = await GetCategoryById(categoryId);

			await IsUserTheOwner(category, userExternalId);

			return CategoryDto.CategoryDtoToCategory(category);
		}

		public async Task UpdateCategoryAsync(CategoryDto categoryDto, string userExternalId)
		{
			Category? category = await GetCategoryById(categoryDto.Id);

			await IsUserTheOwner(category, userExternalId);
			
			category.Name = categoryDto.Name;
			category.Description = categoryDto.Description;
			category.Icon = categoryDto.Icon;
			category.ModifiedOn = DateTime.UtcNow;

			await Repository.SaveChangesAsync();
		}

		private async Task<Category> GetCategoryById(string categoryId)
		{
			Category? category = await Repository
				.FirstOrDefaultAsync<Category>(c => c.Id == Guid.Parse(categoryId));

			if (category == null)
			{
				throw new ArgumentNullException($"Service: {nameof(CategoryService)}, Method: {nameof(GetCategoryById)} Category with id: {categoryId} is missing");
			}

			return category;
		}

		private async Task IsUserTheOwner(Category category, string userExternalId) 
		{
			User? user = _userService.GetUserByExternalId(userExternalId);

			if (category.Owner != null && category.OwnerId != user.Id)
			{
				throw new ArgumentException($"User id: {user.Id} is not the owner of category: {category.Id}");
			}
		}
	}
}

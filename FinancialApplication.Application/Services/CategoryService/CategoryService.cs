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
	}
}

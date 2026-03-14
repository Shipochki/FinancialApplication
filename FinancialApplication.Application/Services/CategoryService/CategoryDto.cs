using FinancialApplication.Domain.Entities;

namespace FinancialApplication.Application.Services.CategoryService
{
	public class CategoryDto : BaseDto
	{
		public required string Name { get; set; }
		public string? Description { get; set; }
		public required string Icon { get; set; }
		public bool IsGlobal { get; set; }
		public string? OwnerId { get; set; }

		public static CategoryDto CategoryDtoToCategory(Category category)
		{
			return new CategoryDto
			{
				Id = category.Id.ToString(),
				Name = category.Name,
				Description = category.Description,
				Icon = category.Icon,
				IsGlobal = category.IsGlobal,
				OwnerId = category.OwnerId.ToString(),
			};
		}
	}
}

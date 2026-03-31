namespace FinancialApplication.Api.DTOs.Category
{
	using System.ComponentModel.DataAnnotations;
	using static FinancialApplication.Domain.Common.DataConstants.Category;

	public class CreateCategoryDto
	{
		[MaxLength(MaxLengthName)]
		public required string Name { get; set; }
		[MaxLength(MaxLengthDescription)]
		public string? Description { get; set; }
		public required string Icon { get; set; }
	}
}

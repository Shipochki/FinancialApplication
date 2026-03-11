namespace FinancialApplication.Api.DTOs.Category
{
    public class GetCategoryDto
    {
        public required string Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public required string Icon { get; set; }
        public bool IsGlobal { get; set; }
        public string? OwnerId { get; set; }
    }
}

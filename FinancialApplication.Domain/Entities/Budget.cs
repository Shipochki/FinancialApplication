namespace FinancialApplication.Domain.Entities
{
    using FinancialApplication.Domain.EntityModels;
    using FinancialApplication.Domain.Enums;

    public class Budget : SoftDeleteEntity
    {
        public required string Name { get; set; }
        public decimal Amount { get; set; }
        public string? Description { get; set; }
        public TypeBudget Type { get; set; }
        public required Guid CategoryId { get; set; }
        public required Category Category { get; set; }
        public Guid AccountId { get; set; }
        public required Account Account { get; set; }
    }
}

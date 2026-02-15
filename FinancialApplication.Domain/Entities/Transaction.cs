namespace FinancialApplication.Domain.Entities
{
    using FinancialApplication.Domain.EntityModels;
    using FinancialApplication.Domain.Enums;

    public class Transaction : SoftDeleteEntity
    {
        public TypeTransaction Type { get; set; }
        public required decimal Amount { get; set; }
        public required DateTime Date { get; set; }
        public string? Description { get; set; }
        public required Guid CategoryId { get; set; }
        public required Category Category { get; set; }
        public required Guid AccountId { get; set; }
        public required Account Account { get; set; }
    }
}

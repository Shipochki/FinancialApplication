namespace FinancialApplication.Domain.Entities
{
    using FinancialApplication.Domain.EntityModels;
    using FinancialApplication.Domain.Enums;

    public class Account : SoftDeleteEntity
    {
        public required string Name { get; set; }
        public decimal Balance { get; set; }
        public string? Description { get; set; }
        public Currency Currency { get; set; }
        public required Guid OwnerId { get; set; }
        public required User Owner { get; set; }
        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
        public ICollection<Budget> Budgets { get; set; } = new List<Budget>();
    }
}

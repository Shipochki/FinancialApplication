namespace FinancialApplication.Domain.Entities
{
    using FinancialApplication.Domain.EntityModels;

    public class Category : SoftDeleteEntity
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public required string Icon { get; set; }
        public bool IsGlobal { get; set; }
        public Guid? OwnerId { get; set; }
        public User? Owner { get; set; }
        public ICollection<Budget> Budgets { get; set; } = new List<Budget>();
        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}

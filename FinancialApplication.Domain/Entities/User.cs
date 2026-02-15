namespace FinancialApplication.Domain.Entities
{
    using FinancialApplication.Domain.EntityModels;

    public class User : SoftDeleteEntity
    {
        public string? ExternalIdentityId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public ICollection<Account> Accounts { get; set; } = new List<Account>();  
        public ICollection<Category> Categories { get; set; } = new List<Category>();
    }
}

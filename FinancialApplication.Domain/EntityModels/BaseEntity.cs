namespace FinancialApplication.Domain.EntityModels
{
    public abstract class BaseEntity : IActionInfo
    {
        public Guid Id { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}

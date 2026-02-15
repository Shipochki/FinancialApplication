namespace FinancialApplication.Domain.EntityModels
{
    public abstract class SoftDeleteEntity : BaseEntity, ISoftDeleteEntity
    {
        public bool IsDeleted { get; set; }
        public DateTime? DeletedOn { get; set; }
    }
}
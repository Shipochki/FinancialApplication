namespace FinancialApplication.Domain.EntityModels
{
    public interface ISoftDeleteEntity
    {
        public bool IsDeleted { get; set; }

        public DateTime? DeletedOn { get; set; }
    }
}

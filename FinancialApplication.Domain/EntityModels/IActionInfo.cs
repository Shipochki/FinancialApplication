namespace FinancialApplication.Domain.EntityModels
{
    public interface IActionInfo
    {
        public DateTime CreatedOn { get; set; }

        public DateTime? ModifiedOn { get; set; }
    }
}

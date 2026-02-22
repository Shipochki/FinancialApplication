namespace FinancialApplication.Api.DTOs.Transaction
{
    using System.ComponentModel.DataAnnotations;
    using static FinancialApplication.Domain.Common.DataConstants.Transaction;

    public class CreateTransactionDto
    {
        [Range(MinRangeType, MaxRangeType)]
        public int Type { get; set; }
        public required decimal Amount { get; set; }
        public required string Date { get; set; }

        [MaxLength(MaxLengthDescription)]
        public string? Description { get; set; }
        public required string CategoryId { get; set; }
        public required string AccountId { get; set; }
    }
}

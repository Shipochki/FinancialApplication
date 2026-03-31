namespace FinancialApplication.Api.DTOs.Account
{
	using System.ComponentModel.DataAnnotations;
	using static FinancialApplication.Domain.Common.DataConstants.Account;

	public class UpdateAccountDto
	{
		public required string Id { get; set; }
		[MaxLength(MaxLengthName)]
		[MinLength(MinLengthName)]
		public required string Name { get; set; }
		public decimal Balance { get; set; }

		[MaxLength(MaxLengthDescription)]
		public string? Description { get; set; }

		[Range(MinRangeCurrency, MaxRangeCurrency)]
		public int Currency { get; set; }
	}
}

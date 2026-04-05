namespace FinancialApplication.Api.DTOs.Transaction
{
	public class TransactionsPaginationDto
	{
		public int Count { get; set; }
		public List<GetTransactionDto>? Items { get; set; }
	}
}

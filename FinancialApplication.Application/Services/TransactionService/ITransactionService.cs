namespace FinancialApplication.Application.Services.TransactionService
{
    public interface ITransactionService
    {
        Task CreateTransactionAsync(TransactionDto transactionDto);
        Task UpdateTransactionAsync(TransactionDto transactionDto);
        Task DeleteTransactionAsync(string transactionId);
        Task<TransactionDto> GetTransactionByIdAsync(string transactionId);
        Task<List<TransactionDto>> GetTopTransactionsByAccountId(string accountId, int number);
		List<TransactionDto> GetAllTransactionsForScroll(string accountId, int skip, int pageSize);

        int GetTransactionsCount(string accountId);
    }
}

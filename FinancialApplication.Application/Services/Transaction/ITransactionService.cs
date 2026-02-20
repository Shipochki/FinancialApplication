namespace FinancialApplication.Application.Services.Transaction
{
    public interface ITransactionService
    {
        Task CreateTransactionAsync(TransactionDto transactionDto);
        Task UpdateTransactionAsync(TransactionDto transactionDto);
        Task DeleteTransactionAsync(string transactionId);
        Task<TransactionDto> GetTransactionByIdAsync(string transactionId);
    }
}

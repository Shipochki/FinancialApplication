namespace FinancialApplication.Application.Services.TransactionService
{
    public interface ITransactionService
    {
        Task CreateTransactionAsync(TransactionDto transactionDto);
        Task UpdateTransactionAsync(TransactionDto transactionDto);
        Task DeleteTransactionAsync(string transactionId);
        Task<TransactionDto> GetTransactionByIdAsync(string transactionId);
    }
}

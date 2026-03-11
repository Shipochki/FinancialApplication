namespace FinancialApplication.Application.Services.TransactionService
{
    using FinancialApplication.Application.Common.Interfaces.Repository;
    using FinancialApplication.Domain.Entities;
    using FinancialApplication.Domain.Enums;

    public class TransactionService : BaseService, ITransactionService
    {
        public TransactionService(IRepository repository) : base(repository)
        {
        }

        public async Task CreateTransactionAsync(TransactionDto transactionDto)
        {
            Account? account = await Repository.GetByIdAsync<Account>(Guid.Parse(transactionDto.AccountId));
            if (account == null)
            {
                throw new ArgumentNullException($"{nameof(TransactionService)} - {nameof(CreateTransactionAsync)} - {nameof(Account)} not found");
            }

            Category? category = await Repository.GetByIdAsync<Category>(Guid.Parse(transactionDto.CategoryId));
            if(category == null)
            {
                throw new ArgumentNullException($"{nameof(TransactionService)} - {nameof(CreateTransactionAsync)} - {nameof(category)} not found");
            }

            Transaction transaction = new Transaction
            {
                Amount = transactionDto.Amount,
                Date = transactionDto.Date,
                Description = transactionDto.Description,
                Type = (TypeTransaction)transactionDto.Type,
                AccountId = account.Id,
                Account = account,
                CategoryId = category.Id,
                Category = category,
                CreatedOn = DateTime.UtcNow
            };

            account.Balance += transaction.Type == TypeTransaction.Income ? transaction.Amount : -transaction.Amount;


            await Repository.AddAsync(transaction);
            await Repository.SaveChangesAsync();        }

        public Task DeleteTransactionAsync(string transactionId)
        {
            throw new NotImplementedException();
        }

        public async Task<List<TransactionDto>> GetTopTransactionsByAccountId(string accountId, int number)
        {
            Account? account = await Repository.GetByIdAsync<Account>(Guid.Parse(accountId));
            if (account == null)
            {
                throw new ArgumentNullException($"{nameof(TransactionService)} - {nameof(CreateTransactionAsync)} - {nameof(Account)} not found");
            }

            return Repository.All<Transaction>()
                .Where(t => t.AccountId == account.Id)
                .OrderByDescending(t => t.Date)
                .Take(number)
                .Select(t => TransactionDto.TransactionToTransactionDto(t))
                .ToList();
        }

        public Task<TransactionDto> GetTransactionByIdAsync(string transactionId)
        {
            throw new NotImplementedException();
        }

        public Task UpdateTransactionAsync(TransactionDto transactionDto)
        {
            throw new NotImplementedException();
        }
    }
}

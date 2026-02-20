namespace FinancialApplication.Application.Services.Transaction
{
    using FinancialApplication.Application.Common.Interfaces.Repository;
    using FinancialApplication.Domain.Entities;
    using FinancialApplication.Domain.Enums;

    public class TransactionService : BaseService, ITransactionService
    {
        public TransactionService(IRepository repository) : base(repository)
        {
        }

        public Task CreateTransactionAsync(TransactionDto transactionDto)
        {
            Account? account = Repository.GetByIdAsync<Account>(Guid.Parse(transactionDto.AccountId)).Result;
            if (account == null)
            {
                throw new ArgumentNullException("Account not found");
            }

            Category? category = Repository.GetByIdAsync<Category>(Guid.Parse(transactionDto.CategoryId)).Result;
            if(category == null)
            {
                throw new ArgumentNullException("Category not found");
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


            Repository.AddAsync(transaction);
            return Repository.SaveChangesAsync();
        }

        public Task DeleteTransactionAsync(string transactionId)
        {
            throw new NotImplementedException();
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

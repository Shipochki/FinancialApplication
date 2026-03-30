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

        public async Task DeleteTransactionAsync(string transactionId)
        {
			Transaction? transaction = await Repository
							.FirstOrDefaultAsync<Transaction>(t => t.Id == Guid.Parse(transactionId));

			if (transaction == null)
			{
				throw new ArgumentNullException($"{nameof(TransactionService)} - {nameof(GetTransactionByIdAsync)} - {nameof(Transaction)} not found");
			}

			Account? account = await Repository.GetByIdAsync<Account>(transaction.AccountId);

			if (account == null)
			{
				throw new ArgumentNullException($"{nameof(TransactionService)} - {nameof(GetTransactionByIdAsync)} - {nameof(Account)} not found");
			}

            account.Balance -= transaction.Type == TypeTransaction.Income ? transaction.Amount : -transaction.Amount;
			transaction.IsDeleted = true;

            await Repository.SaveChangesAsync();
		}

		public List<TransactionDto> GetAllTransactionsForScroll(string accountId, int skip, int pageSize)
		{
            List<TransactionDto> transactions = Repository
                .All<Transaction>()
                .Where(t => t.AccountId == Guid.Parse(accountId) && t.IsDeleted == false)
                .OrderByDescending(t => t.Date)
                .Skip(skip)
                .Take(pageSize)
                .Select(TransactionDto.TransactionToTransactionDto)
                .ToList();

            return transactions;
		}

		public async Task<List<TransactionDto>> GetTopTransactionsByAccountId(string accountId, int number)
        {
            Account? account = await Repository.GetByIdAsync<Account>(Guid.Parse(accountId));
            if (account == null)
            {
                throw new ArgumentNullException($"{nameof(TransactionService)} - {nameof(CreateTransactionAsync)} - {nameof(Account)} not found");
            }

            return Repository.All<Transaction>()
                .Where(t => t.AccountId == account.Id && t.IsDeleted == false)
                .OrderByDescending(t => t.Date)
                .Take(number)
                .Select(t => TransactionDto.TransactionToTransactionDto(t))
                .ToList();
        }

        public async Task<TransactionDto> GetTransactionByIdAsync(string transactionId)
        {
            Transaction? transaction = await Repository
                .FirstOrDefaultAsync<Transaction>(t => t.Id == Guid.Parse(transactionId) && t.IsDeleted == false);

            if (transaction == null)
            {
                throw new ArgumentNullException($"{nameof(TransactionService)} - {nameof(GetTransactionByIdAsync)} - {nameof(Transaction)} not found");
            }

            return TransactionDto.TransactionToTransactionDto(transaction);
        }

        public async Task UpdateTransactionAsync(TransactionDto transactionDto)
        {
			Transaction? transaction = await Repository
				.FirstOrDefaultAsync<Transaction>(t => t.Id == Guid.Parse(transactionDto.Id));

			if (transaction == null)
			{
				throw new ArgumentNullException($"{nameof(TransactionService)} - {nameof(GetTransactionByIdAsync)} - {nameof(Transaction)} not found");
			}

            Account? account = await Repository.GetByIdAsync<Account>(transaction.AccountId);

			if (account == null)
			{
				throw new ArgumentNullException($"{nameof(TransactionService)} - {nameof(GetTransactionByIdAsync)} - {nameof(Account)} not found");
			}

            if(transactionDto.Amount > transaction.Amount) 
            { 
                if(transactionDto.Type == (int)TypeTransaction.Income)
                {
                    account.Balance += transactionDto.Amount - transaction.Amount;
                }
                else
                {
                    account.Balance -= transactionDto.Amount - transaction.Amount;
                }
            }
            else if(transactionDto.Amount < transaction.Amount)
            {
                if(transactionDto.Type == (int)TypeTransaction.Income)
                {
                    account.Balance -= transaction.Amount - transactionDto.Amount;
                }
                else
                {
                    account.Balance += transaction.Amount - transactionDto.Amount;
                }
            }

            transaction.Amount = transactionDto.Amount;
            transaction.Date = transactionDto.Date;
            transaction.Description = transactionDto.Description;
            transaction.Type = (TypeTransaction)transactionDto.Type;
            transaction.ModifiedOn = DateTime.UtcNow;

			await Repository.SaveChangesAsync();
		}
    }
}

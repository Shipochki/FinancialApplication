namespace FinancialApplication.UnitTests
{
	using FinancialApplication.Application.Common.Interfaces.Repository;
	using FinancialApplication.Application.Services.TransactionService;
	using FinancialApplication.Domain.Entities;
	using FinancialApplication.Domain.Enums;
	using Moq;
	using System.Linq.Expressions;

	[TestFixture]
	public class TransactionServiceTests
	{
		private Mock<IRepository> _repositoryMock;
		private TransactionService _transactionService;

		[SetUp]
		public void SetUp()
		{
			_repositoryMock = new Mock<IRepository>();
			_transactionService = new TransactionService(_repositoryMock.Object);
		}

		#region CreateTransactionAsync Tests

		[Test]
		public async Task CreateTransactionAsync_WhenIncome_ShouldAddAmountToBalanceAndSaveChanges()
		{
			// Arrange
			var accountId = Guid.NewGuid();
			var categoryId = Guid.NewGuid();
			var account = new Account { Id = accountId, Balance = 1000m, Name = "test", Owner = new User(), OwnerId = Guid.NewGuid() };
			var category = new Category { Id = categoryId, Icon = "test", Name = "test" };

			var transactionDto = new TransactionDto
			{
				AccountId = accountId.ToString(),
				CategoryId = categoryId.ToString(),
				Amount = 500m,
				Type = (int)TypeTransaction.Income,
				Date = DateTime.UtcNow,
			};

			_repositoryMock.Setup(r => r.GetByIdAsync<Account>(accountId)).ReturnsAsync(account);
			_repositoryMock.Setup(r => r.GetByIdAsync<Category>(categoryId)).ReturnsAsync(category);

			// Act
			await _transactionService.CreateTransactionAsync(transactionDto);

			// Assert
			Assert.That(account.Balance, Is.EqualTo(1500m)); // 1000 + 500
			_repositoryMock.Verify(r => r.AddAsync(It.IsAny<Transaction>()), Times.Once);
			_repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
		}

		[Test]
		public async Task CreateTransactionAsync_WhenExpense_ShouldSubtractAmountFromBalance()
		{
			// Arrange
			var accountId = Guid.NewGuid();
			var categoryId = Guid.NewGuid();
			var account = new Account { Id = accountId, Balance = 1000m, Name = "test", Owner = new User(), OwnerId = Guid.NewGuid() };
			var category = new Category { Id = categoryId, Icon = "test", Name = "test" };

			var transactionDto = new TransactionDto
			{
				AccountId = accountId.ToString(),
				CategoryId = categoryId.ToString(),
				Amount = 200m,
				Type = (int)TypeTransaction.Expense, // Assuming Expense is the alternative
				Date = DateTime.UtcNow,
			};

			_repositoryMock.Setup(r => r.GetByIdAsync<Account>(accountId)).ReturnsAsync(account);
			_repositoryMock.Setup(r => r.GetByIdAsync<Category>(categoryId)).ReturnsAsync(category);

			// Act
			await _transactionService.CreateTransactionAsync(transactionDto);
			// Assert
			Assert.That(account.Balance, Is.EqualTo(800m)); // 1000 - 200
		}

		[Test]
		public void CreateTransactionAsync_WhenAccountNotFound_ShouldThrowArgumentNullException()
		{
			var dto = new TransactionDto { AccountId = Guid.NewGuid().ToString(), Amount = 0m, CategoryId = Guid.NewGuid().ToString(), Date = DateTime.UtcNow };
			_repositoryMock.Setup(r => r.GetByIdAsync<Account>(It.IsAny<Guid>())).ReturnsAsync((Account)null);

			var ex = Assert.ThrowsAsync<ArgumentNullException>(async () => await _transactionService.CreateTransactionAsync(dto));
			Assert.That(ex.Message, Does.Contain(nameof(Account)));
		}

		#endregion

		#region DeleteTransactionAsync Tests

		[Test]
		public async Task DeleteTransactionAsync_WhenIncome_ShouldSubtractAmountFromBalanceAndSetDeleted()
		{
			// Arrange
			var accountId = Guid.NewGuid();
			var transactionId = Guid.NewGuid();
			var account = new Account { Id = accountId, Balance = 1500m, Name = "test", Owner = new User(), OwnerId = Guid.NewGuid() };
			var transaction = new Transaction
			{
				Id = transactionId,
				AccountId = accountId,
				Amount = 500m,
				Type = TypeTransaction.Income,
				Date = DateTime.UtcNow,
				Account = account,
				Category = new Category { Id = Guid.NewGuid(), Icon = "test", Name = "test" },
				CategoryId = Guid.NewGuid()
			};

			_repositoryMock.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Transaction, bool>>>()))
						   .ReturnsAsync(transaction);
			_repositoryMock.Setup(r => r.GetByIdAsync<Account>(accountId)).ReturnsAsync(account);

			// Act
			await _transactionService.DeleteTransactionAsync(transactionId.ToString());

			// Assert
			Assert.That(account.Balance, Is.EqualTo(1000m)); // 1500 - 500
			Assert.That(transaction.IsDeleted, Is.True);
			_repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
		}

		[Test]
		public async Task DeleteTransactionAsync_WhenExpense_ShouldAddAmountToBalance()
		{
			// Arrange
			var accountId = Guid.NewGuid();
			var transactionId = Guid.NewGuid();
			var account = new Account { Id = accountId, Balance = 800m, Name = "test", Owner = new User(), OwnerId = Guid.NewGuid() };
			var transaction = new Transaction
			{
				Id = transactionId,
				AccountId = accountId,
				Amount = 200m,
				Type = TypeTransaction.Expense,
				Date = DateTime.UtcNow,
				Account = account,
				Category = new Category { Id = Guid.NewGuid(), Icon = "test", Name = "test" },
				CategoryId = Guid.NewGuid(),
			};

			_repositoryMock.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Transaction, bool>>>()))
						   .ReturnsAsync(transaction);
			_repositoryMock.Setup(r => r.GetByIdAsync<Account>(accountId)).ReturnsAsync(account);

			// Act
			await _transactionService.DeleteTransactionAsync(transactionId.ToString());

			// Assert
			Assert.That(account.Balance, Is.EqualTo(1000m)); // 800 + 200
		}

		#endregion

		#region Pagination and Query Tests

		[Test]
		public void GetAllTransactionsForScroll_ShouldReturnPaginatedAndOrderedTransactions()
		{
			// Arrange
			var accountId = Guid.NewGuid();
			var account = new Account { Id = accountId, Balance = 1000m, Name = "test", Owner = new User(), OwnerId = Guid.NewGuid() };
			var transactions = new List<Transaction>
			{
				new Transaction { Id = Guid.NewGuid(), AccountId = accountId, Date = new DateTime(2023, 1, 1), IsDeleted = false, Account = account, Amount = 0m, Category = new Category(){Icon = "test", Name = "test" }, CategoryId = Guid.NewGuid() },
				new Transaction { Id = Guid.NewGuid(), AccountId = accountId, Date = new DateTime(2023, 1, 5), IsDeleted = false, Account = account, Amount = 0m, Category = new Category(){Icon = "test", Name = "test" }, CategoryId = Guid.NewGuid() }, // Should be first
                new Transaction { Id = Guid.NewGuid(), AccountId = accountId, Date = new DateTime(2023, 1, 3), IsDeleted = false, Account = account, Amount = 0m, Category = new Category(){Icon = "test", Name = "test" }, CategoryId = Guid.NewGuid() }
			}.AsQueryable();

			_repositoryMock.Setup(r => r.All<Transaction>()).Returns(transactions);

			// Act (Skip 0, Take 2)
			var result = _transactionService.GetAllTransactionsForScroll(accountId.ToString(), 0, 2);

			// Assert
			Assert.That(result.Count, Is.EqualTo(2));
			Assert.That(result[0].Date, Is.EqualTo(new DateTime(2023, 1, 5))); // Most recent first
			Assert.That(result[1].Date, Is.EqualTo(new DateTime(2023, 1, 3)));
		}

		[Test]
		public void GetTransactionsCount_ShouldReturnNonDeletedCount()
		{
			// Arrange
			var accountId = Guid.NewGuid();
			var account = new Account { Id = accountId, Balance = 1000m, Name = "test", Owner = new User(), OwnerId = Guid.NewGuid() };
			var transactions = new List<Transaction>
			{
				new Transaction { AccountId = accountId, IsDeleted = false, Account = account, Date = DateTime.UtcNow, Amount = 0m, Category = new Category(){Icon = "test", Name = "test" }, CategoryId = Guid.NewGuid() },
				new Transaction { AccountId = accountId, IsDeleted = true, Account = account, Date = DateTime.UtcNow, Amount = 0m, Category = new Category(){Icon = "test", Name = "test" }, CategoryId = Guid.NewGuid() },
				new Transaction { AccountId = Guid.NewGuid(), IsDeleted = false, Account = account, Date = DateTime.UtcNow, Amount = 0m, Category = new Category(){Icon = "test", Name = "test" }, CategoryId = Guid.NewGuid() } // Different account
            }.AsQueryable();

			_repositoryMock.Setup(r => r.All<Transaction>()).Returns(transactions);

			// Act
			var count = _transactionService.GetTransactionsCount(accountId.ToString());

			// Assert
			Assert.That(count, Is.EqualTo(1));
		}

		#endregion

		#region UpdateTransactionAsync Tests

		[Test]
		public async Task UpdateTransactionAsync_WhenIncomeAmountIncreases_ShouldIncreaseBalance()
		{
			// Arrange
			var accountId = Guid.NewGuid();
			var account = new Account { Id = accountId, Balance = 1000m, Name = "test", Owner = new User(), OwnerId = Guid.NewGuid() };
			var transaction = new Transaction { Id = Guid.NewGuid(), AccountId = accountId, Account = account, Amount = 100m, Type = TypeTransaction.Income, Category = new Category() { Icon = "test", Name = "test"}, CategoryId = Guid.NewGuid(), Date = DateTime.UtcNow };
			var dto = new TransactionDto { Id = transaction.Id.ToString(), Amount = 150m, Type = (int)TypeTransaction.Income, AccountId = accountId.ToString(), CategoryId =  Guid.NewGuid().ToString(), Date = DateTime.UtcNow };

			_repositoryMock.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Transaction, bool>>>())).ReturnsAsync(transaction);
			_repositoryMock.Setup(r => r.GetByIdAsync<Account>(accountId)).ReturnsAsync(account);

			// Act
			await _transactionService.UpdateTransactionAsync(dto);

			// Assert
			Assert.That(account.Balance, Is.EqualTo(1050m)); // Balance + (NewAmount - OldAmount) -> 1000 + (150 - 100)
			_repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
		}

		[Test]
		public async Task UpdateTransactionAsync_WhenExpenseAmountIncreases_ShouldDecreaseBalance()
		{
			// Arrange
			var accountId = Guid.NewGuid();
			var account = new Account { Id = accountId, Balance = 1000m, Name = "test", Owner = new User(), OwnerId = Guid.NewGuid() };
			var transaction = new Transaction { Id = Guid.NewGuid(), AccountId = accountId, Amount = 100m, Type = TypeTransaction.Expense, Account = account, Category = new Category() { Icon = "test", Name = "test" }, CategoryId = Guid.NewGuid(), Date = DateTime.UtcNow };
			var dto = new TransactionDto { Id = transaction.Id.ToString(), Amount = 150m, Type = (int)TypeTransaction.Expense, AccountId = accountId.ToString(), CategoryId = Guid.NewGuid().ToString(), Date = DateTime.UtcNow };

			_repositoryMock.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Transaction, bool>>>())).ReturnsAsync(transaction);
			_repositoryMock.Setup(r => r.GetByIdAsync<Account>(accountId)).ReturnsAsync(account);

			// Act
			await _transactionService.UpdateTransactionAsync(dto);

			// Assert
			Assert.That(account.Balance, Is.EqualTo(950m)); // Balance - (NewAmount - OldAmount) -> 1000 - (150 - 100)
		}

		[Test]
		public async Task UpdateTransactionAsync_WhenIncomeAmountDecreases_ShouldDecreaseBalance()
		{
			// Arrange
			var accountId = Guid.NewGuid();
			var account = new Account { Id = accountId, Balance = 1000m, Name = "test", Owner = new User(), OwnerId = Guid.NewGuid() };
			var transaction = new Transaction { Id = Guid.NewGuid(), Account = account, AccountId = accountId, Amount = 200m, Type = TypeTransaction.Income, Category = new Category() { Icon = "test", Name = "test" }, CategoryId = Guid.NewGuid(), Date = DateTime.UtcNow };
			var dto = new TransactionDto { Id = transaction.Id.ToString(), Amount = 150m, Type = (int)TypeTransaction.Income, AccountId = accountId.ToString(), CategoryId = Guid.NewGuid().ToString(), Date = DateTime.UtcNow };

			_repositoryMock.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Transaction, bool>>>())).ReturnsAsync(transaction);
			_repositoryMock.Setup(r => r.GetByIdAsync<Account>(accountId)).ReturnsAsync(account);

			// Act
			await _transactionService.UpdateTransactionAsync(dto);

			// Assert
			Assert.That(account.Balance, Is.EqualTo(950m)); // Balance - (OldAmount - NewAmount) -> 1000 - (200 - 150)
		}

		[Test]
		public async Task UpdateTransactionAsync_WhenExpenseAmountDecreases_ShouldIncreaseBalance()
		{
			// Arrange
			var accountId = Guid.NewGuid();
			var account = new Account { Id = accountId, Balance = 1000m, Name = "test", Owner = new User(), OwnerId = Guid.NewGuid() };
			var transaction = new Transaction { Id = Guid.NewGuid(), Account = account, AccountId = accountId, Amount = 200m, Type = TypeTransaction.Expense, Category = new Category() { Icon = "test", Name = "test" }, CategoryId = Guid.NewGuid(), Date = DateTime.UtcNow };
			var dto = new TransactionDto { Id = transaction.Id.ToString(), Amount = 150m, Type = (int)TypeTransaction.Expense, AccountId = accountId.ToString(), CategoryId = Guid.NewGuid().ToString(), Date = DateTime.UtcNow };

			_repositoryMock.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Transaction, bool>>>())).ReturnsAsync(transaction);
			_repositoryMock.Setup(r => r.GetByIdAsync<Account>(accountId)).ReturnsAsync(account);

			// Act
			await _transactionService.UpdateTransactionAsync(dto);

			// Assert
			Assert.That(account.Balance, Is.EqualTo(1050m)); // Balance + (OldAmount - NewAmount) -> 1000 + (200 - 150)
		}

		#endregion
	}
}
namespace FinancialApplication.UnitTests
{
	using Moq;
	using System.Linq.Expressions;
	using FinancialApplication.Application.Services.BudgetService;
	using FinancialApplication.Application.Common.Interfaces.Repository;
	using FinancialApplication.Domain.Entities;
	using FinancialApplication.Domain.Enums;

	[TestFixture]
	public class BudgetServiceTests
	{
		private Mock<IRepository> _repositoryMock;
		private BudgetService _budgetService;

		[SetUp]
		public void SetUp()
		{
			_repositoryMock = new Mock<IRepository>();
			_budgetService = new BudgetService(_repositoryMock.Object);
		}

		#region CreateBudgetAsync Tests

		[Test]
		public async Task CreateBudgetAsync_WhenAccountAndCategoryExist_ShouldAddBudgetAndSaveChanges()
		{
			// Arrange
			var budgetDto = new BudgetDto
			{
				AccountId = Guid.NewGuid().ToString(),
				CategoryId = Guid.NewGuid().ToString(),
				Name = "Groceries",
				Amount = 500m,
				Description = "Monthly groceries",
				StartDate = DateTime.UtcNow,
				EndDate = DateTime.UtcNow.AddMonths(1),
				Type = 1 // Assuming 1 maps to a valid TypeBudget
			};

			var account = new Account { Id = Guid.Parse(budgetDto.AccountId), Name = "test", Owner = new User(), OwnerId = Guid.NewGuid() };
			var category = new Category { Id = Guid.Parse(budgetDto.CategoryId), Name = "test", Icon = "test" };

			_repositoryMock.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Account, bool>>>()))
						   .ReturnsAsync(account);
			_repositoryMock.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Category, bool>>>()))
						   .ReturnsAsync(category);

			// Act
			await _budgetService.CreateBudgetAsync(budgetDto);

			// Assert
			_repositoryMock.Verify(r => r.AddAsync(It.Is<Budget>(b =>
				b.Name == budgetDto.Name &&
				b.Amount == budgetDto.Amount &&
				b.AccountId == account.Id &&
				b.CategoryId == category.Id)), Times.Once);
			_repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
		}

		[Test]
		public void CreateBudgetAsync_WhenAccountDoesNotExist_ShouldThrowArgumentNullException()
		{
			// Arrange
			var budgetDto = new BudgetDto { AccountId = Guid.NewGuid().ToString(), CategoryId = Guid.NewGuid().ToString(), Name = "test" };

			_repositoryMock.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Account, bool>>>()))
						   .ReturnsAsync((Account)null);

			// Act & Assert
			var ex = Assert.ThrowsAsync<ArgumentNullException>(async () => await _budgetService.CreateBudgetAsync(budgetDto));
			Assert.That(ex.Message, Does.Contain(nameof(Account)));
		}

		[Test]
		public void CreateBudgetAsync_WhenCategoryDoesNotExist_ShouldThrowArgumentNullException()
		{
			// Arrange
			var budgetDto = new BudgetDto { AccountId = Guid.NewGuid().ToString(), CategoryId = Guid.NewGuid().ToString(), Name = "test" };
			var account = new Account { Id = Guid.Parse(budgetDto.AccountId), Name = "test", Owner = new User(), OwnerId = Guid.NewGuid() };

			_repositoryMock.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Account, bool>>>()))
						   .ReturnsAsync(account);
			_repositoryMock.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Category, bool>>>()))
						   .ReturnsAsync((Category)null);

			// Act & Assert
			var ex = Assert.ThrowsAsync<ArgumentNullException>(async () => await _budgetService.CreateBudgetAsync(budgetDto));
			Assert.That(ex.Message, Does.Contain(nameof(Category)));
		}

		#endregion

		#region DeleteBudgetAsync Tests

		[Test]
		public async Task DeleteBudgetAsync_WhenBudgetExists_ShouldSetIsDeletedAndSaveChanges()
		{
			// Arrange
			var budgetId = Guid.NewGuid();
			var account = new Account { Id = Guid.NewGuid(), Name = "test", Owner = new User(), OwnerId = Guid.NewGuid() };
			var category = new Category { Id = Guid.NewGuid(), Name = "test", Icon = "test" };
			var budget = new Budget { Id = budgetId, Account = account, Category = category, CategoryId = Guid.NewGuid(), IsDeleted = false, Name = "test", };

			_repositoryMock.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Budget, bool>>>()))
						   .ReturnsAsync(budget);

			// Act
			await _budgetService.DeleteBudgetAsync(budgetId.ToString());

			// Assert
			Assert.That(budget.IsDeleted, Is.True);
			_repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
		}

		[Test]
		public void DeleteBudgetAsync_WhenBudgetDoesNotExist_ShouldThrowArgumentNullException()
		{
			// Arrange
			var budgetId = Guid.NewGuid().ToString();

			_repositoryMock.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Budget, bool>>>()))
						   .ReturnsAsync((Budget)null);

			// Act & Assert
			var ex = Assert.ThrowsAsync<ArgumentNullException>(async () => await _budgetService.DeleteBudgetAsync(budgetId));
			Assert.That(ex.Message, Does.Contain(nameof(Budget)));
		}

		#endregion

		#region GetAllBudgetsByAccountId Tests

		[Test]
		public void GetAllBudgetsByAccountId_ShouldReturnMappedBudgetDtos()
		{
			// Arrange
			var accountId = Guid.NewGuid();
			var categoryId = Guid.NewGuid();

			var budgets = new List<Budget>
			{
				new Budget
				{
					Id = Guid.NewGuid(),
					AccountId = accountId,
					CategoryId = categoryId,
					Name = "Test 1",
					Amount = 100,
					IsDeleted = false,
					Account = new Account { Id = accountId, Name = "test", Owner = new User(), OwnerId = Guid.NewGuid() },
					Category = new Category { Id = categoryId, Name = "test", Icon = "test" }
				}
			};

			// Assuming Repository.All returns IEnumerable<T> or IQueryable<T>
			_repositoryMock.Setup(r => r.All(It.IsAny<Expression<Func<Budget, bool>>>()))
						   .Returns(budgets.AsQueryable()); // Adjust to .Returns(budgets) if All() returns IEnumerable

			// Act
			var result = _budgetService.GetAllBudgetsByAccountId(accountId.ToString());

			// Assert
			Assert.That(result, Is.Not.Null);
			Assert.That(result.Count, Is.EqualTo(1));
			Assert.That(result[0].Name, Is.EqualTo("Test 1"));
			Assert.That(result[0].AccountId, Is.EqualTo(accountId.ToString()));
		}

		#endregion

		#region GetBudgetByIdAsync Tests

		[Test]
		public async Task GetBudgetByIdAsync_WhenBudgetExists_ShouldReturnBudgetDto()
		{
			// Arrange
			var budgetId = Guid.NewGuid();
			var accountId = Guid.NewGuid();
			var categoryId = Guid.NewGuid();

			var budget = new Budget
			{
				Id = budgetId,
				AccountId = accountId,
				CategoryId = categoryId,
				Name = "Holiday",
				Amount = 1000m,
				Type = (TypeBudget)2,
				Account = new Account { Id = accountId, Name = "test", Owner = new User(), OwnerId = Guid.NewGuid() },
				Category = new Category { Id = categoryId, Name = "test", Icon = "test" }
			};

			_repositoryMock.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Budget, bool>>>()))
						   .ReturnsAsync(budget);

			// Act
			var result = await _budgetService.GetBudgetByIdAsync(budgetId.ToString());

			// Assert
			Assert.That(result, Is.Not.Null);
			Assert.That(result.Id, Is.EqualTo(budgetId.ToString()));
			Assert.That(result.Name, Is.EqualTo("Holiday"));
			Assert.That(result.Amount, Is.EqualTo(1000m));
		}

		[Test]
		public void GetBudgetByIdAsync_WhenBudgetDoesNotExist_ShouldThrowArgumentNullException()
		{
			// Arrange
			var budgetId = Guid.NewGuid().ToString();

			_repositoryMock.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Budget, bool>>>()))
						   .ReturnsAsync((Budget)null);

			// Act & Assert
			var ex = Assert.ThrowsAsync<ArgumentNullException>(async () => await _budgetService.GetBudgetByIdAsync(budgetId));
			Assert.That(ex.Message, Does.Contain(nameof(Budget)));
		}

		#endregion

		#region UpdateBudgetAsync Tests

		[Test]
		public async Task UpdateBudgetAsync_WhenEntitiesExist_ShouldUpdatePropertiesAndSaveChanges()
		{
			// Arrange
			var budgetDto = new BudgetDto
			{
				Id = Guid.NewGuid().ToString(),
				AccountId = Guid.NewGuid().ToString(),
				CategoryId = Guid.NewGuid().ToString(),
				Name = "Updated Name",
				Amount = 750m,
				Description = "Updated Desc",
				Type = 1
			};

			var account = new Account { Id = Guid.Parse(budgetDto.AccountId), Name = "test", Owner = new User(), OwnerId = Guid.NewGuid() };
			var category = new Category { Id = Guid.Parse(budgetDto.CategoryId), Name = "test", Icon = "test" };
			var budget = new Budget { Id = Guid.Parse(budgetDto.Id), Name = "Old Name", Account = account, Category = category, CategoryId = category.Id };


			_repositoryMock.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Budget, bool>>>()))
						   .ReturnsAsync(budget);
			_repositoryMock.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Account, bool>>>()))
						   .ReturnsAsync(account);
			_repositoryMock.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Category, bool>>>()))
						   .ReturnsAsync(category);

			// Act
			await _budgetService.UpdateBudgetAsync(budgetDto);

			// Assert
			Assert.That(budget.Name, Is.EqualTo("Updated Name"));
			Assert.That(budget.Amount, Is.EqualTo(750m));
			Assert.That(budget.Description, Is.EqualTo("Updated Desc"));
			_repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
		}

		[Test]
		public void UpdateBudgetAsync_WhenBudgetDoesNotExist_ShouldThrowArgumentNullException()
		{
			// Arrange
			var budgetDto = new BudgetDto { Id = Guid.NewGuid().ToString(), CategoryId = Guid.NewGuid().ToString(), Name = "test", AccountId = Guid.NewGuid().ToString() };

			_repositoryMock.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Budget, bool>>>()))
						   .ReturnsAsync((Budget)null);

			// Act & Assert
			var ex = Assert.ThrowsAsync<ArgumentNullException>(async () => await _budgetService.UpdateBudgetAsync(budgetDto));
			Assert.That(ex.Message, Does.Contain(nameof(Budget)));
		}

		[Test]
		public void UpdateBudgetAsync_WhenAccountDoesNotExist_ShouldThrowArgumentNullException()
		{
			// Arrange
			var budgetDto = new BudgetDto { Id = Guid.NewGuid().ToString(), AccountId = Guid.NewGuid().ToString(), CategoryId = Guid.NewGuid().ToString(), Name = "test" };
			var budget = new Budget { Id = Guid.Parse(budgetDto.Id), Name = "test", Account = new Account { Id = Guid.Parse(budgetDto.AccountId), Name = "test", Owner = new User(), OwnerId = Guid.NewGuid(), }, Category = new Category { Id = Guid.Parse(budgetDto.CategoryId), Name = "test", Icon = "test" }, CategoryId = Guid.NewGuid() };

			_repositoryMock.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Budget, bool>>>()))
						   .ReturnsAsync(budget);
			_repositoryMock.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Account, bool>>>()))
						   .ReturnsAsync((Account)null);

			// Act & Assert
			var ex = Assert.ThrowsAsync<ArgumentNullException>(async () => await _budgetService.UpdateBudgetAsync(budgetDto));
			Assert.That(ex.Message, Does.Contain(nameof(Account)));
		}

		[Test]
		public void UpdateBudgetAsync_WhenCategoryDoesNotExist_ShouldThrowArgumentNullException()
		{
			// Arrange
			var budgetDto = new BudgetDto
			{
				Id = Guid.NewGuid().ToString(),
				AccountId = Guid.NewGuid().ToString(),
				CategoryId = Guid.NewGuid().ToString(),
				Name = "Updated Name",
			};

			var account = new Account { Id = Guid.Parse(budgetDto.AccountId), Name = "test", Owner = new User(), OwnerId = Guid.NewGuid() };
			var budget = new Budget { Id = Guid.Parse(budgetDto.Id), Name = "test", Account = account, Category = new Category { Icon = "test", Name = "test" }, CategoryId = Guid.NewGuid() };

			_repositoryMock.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Budget, bool>>>()))
						   .ReturnsAsync(budget);
			_repositoryMock.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Account, bool>>>()))
						   .ReturnsAsync(account);
			_repositoryMock.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Category, bool>>>()))
						   .ReturnsAsync((Category)null);

			// Act & Assert
			var ex = Assert.ThrowsAsync<ArgumentNullException>(async () => await _budgetService.UpdateBudgetAsync(budgetDto));
			Assert.That(ex.Message, Does.Contain(nameof(Category)));
		}

		#endregion
	}
}
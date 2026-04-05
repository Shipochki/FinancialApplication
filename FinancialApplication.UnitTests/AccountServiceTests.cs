namespace FinancialApplication.UnitTests
{
	using FinancialApplication.Application.Common.Interfaces.Repository;
	using FinancialApplication.Application.Services.AccountService;
	using FinancialApplication.Application.Services.UserService;
	using FinancialApplication.Domain.Entities;
	using FinancialApplication.Domain.Enums;
	using Moq;

	[TestFixture]
	public class AccountServiceTests
	{
		private Mock<IRepository> _repositoryMock;
		private Mock<IUserService> _userServiceMock;
		private AccountService _accountService;

		[SetUp]
		public void SetUp()
		{
			_repositoryMock = new Mock<IRepository>();
			_userServiceMock = new Mock<IUserService>();

			// Assuming BaseService accepts IRepository in its constructor
			_accountService = new AccountService(_repositoryMock.Object, _userServiceMock.Object);
		}

		#region CreateAccountAsync Tests

		[Test]
		public async Task CreateAccountAsync_WhenOwnerExists_ShouldAddAccountAndSaveChanges()
		{
			// Arrange
			var request = new AccountDto
			{
				OwnerId = "external-owner-id",
				Name = "Savings",
				Balance = 1000m,
				Description = "My savings",
				Currency = 1 // Assuming 1 maps to a valid Currency enum
			};

			User user = new User { Id = Guid.NewGuid() };
			_userServiceMock.Setup(s => s.GetUserByExternalId(request.OwnerId)).Returns(user);

			// Act
			await _accountService.CreateAccountAsync(request);

			// Assert
			_repositoryMock.Verify(r => r.AddAsync(It.Is<Account>(a =>
				a.Name == request.Name &&
				a.Balance == request.Balance &&
				a.OwnerId == user.Id)), Times.Once);
			_repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
		}

		[Test]
		public void CreateAccountAsync_WhenOwnerDoesNotExist_ShouldThrowException()
		{
			// Arrange
			var request = new AccountDto { Name = "test", OwnerId = "invalid-owner-id" };
			_userServiceMock.Setup(s => s.GetUserByExternalId(request.OwnerId)).Returns((User)null);

			// Act & Assert
			var ex = Assert.ThrowsAsync<Exception>(async () => await _accountService.CreateAccountAsync(request));
			Assert.That(ex.Message, Is.EqualTo("When you try to create an Account, the owner was not found!"));
		}

		#endregion

		#region DeleteAccountAsync Tests

		[Test]
		public async Task DeleteAccountAsync_WhenValidRequest_ShouldSetIsDeletedAndSaveChanges()
		{
			// Arrange
			var accountId = Guid.NewGuid();
			var externalUserId = "external-user-id";
			var userId = Guid.NewGuid();

			var account = new Account { Id = accountId, Name = "test", Owner = new User(), OwnerId = userId, IsDeleted = false };
			var user = new User { Id = userId };

			_repositoryMock.Setup(r => r.GetByIdAsync<Account>(accountId)).ReturnsAsync(account);
			_userServiceMock.Setup(s => s.GetUserByExternalId(externalUserId)).Returns(user);

			// Act
			await _accountService.DeleteAccountAsync(accountId.ToString(), externalUserId);

			// Assert
			Assert.That(account.IsDeleted, Is.True);
			_repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
		}

		[Test]
		public void DeleteAccountAsync_WhenAccountNotFound_ShouldThrowException()
		{
			// Arrange
			var accountId = Guid.NewGuid();
			_repositoryMock.Setup(r => r.GetByIdAsync<Account>(accountId)).ReturnsAsync((Account)null);

			// Act & Assert
			var ex = Assert.ThrowsAsync<Exception>(async () => await _accountService.DeleteAccountAsync(accountId.ToString(), "any-id"));
			Assert.That(ex.Message, Is.EqualTo("Account not found"));
		}

		[Test]
		public void DeleteAccountAsync_WhenUserIsNotOwner_ShouldThrowException()
		{
			// Arrange
			var accountId = Guid.NewGuid();
			var account = new Account { Id = accountId, Name = "test", Owner = new User(), OwnerId = Guid.NewGuid() }; // Owner is someone else
			var user = new User { Id = Guid.NewGuid() };

			_repositoryMock.Setup(r => r.GetByIdAsync<Account>(accountId)).ReturnsAsync(account);
			_userServiceMock.Setup(s => s.GetUserByExternalId("ext-id")).Returns(user);

			// Act & Assert
			var ex = Assert.ThrowsAsync<Exception>(async () => await _accountService.DeleteAccountAsync(accountId.ToString(), "ext-id"));
			Assert.That(ex.Message, Is.EqualTo("You are not the owner of this account"));
		}

		#endregion

		#region GetAccountByIdAsync Tests

		[Test]
		public async Task GetAccountByIdAsync_WhenValidRequest_ShouldReturnAccountDto()
		{
			// Arrange
			var accountId = Guid.NewGuid();
			var externalUserId = "external-user-id";
			var userId = Guid.NewGuid();

			var account = new Account
			{
				Id = accountId,
				OwnerId = userId,
				Name = "Checking",
				Balance = 500m,
				Currency = (Currency)1,
				Owner = new User { Id = userId }
			};
			var user = new User { Id = userId };

			_repositoryMock.Setup(r => r.GetByIdAsync<Account>(accountId)).ReturnsAsync(account);
			_userServiceMock.Setup(s => s.GetUserByExternalId(externalUserId)).Returns(user);

			// Act
			var result = await _accountService.GetAccountByIdAsync(accountId.ToString(), externalUserId);

			// Assert
			Assert.That(result, Is.Not.Null);
			Assert.That(result.Id, Is.EqualTo(accountId.ToString()));
			Assert.That(result.Name, Is.EqualTo("Checking"));
			Assert.That(result.Balance, Is.EqualTo(500m));
		}

		#endregion

		#region GetAccountsByOwnerId Tests

		[Test]
		public void GetAccountsByOwnerId_WhenOwnerExists_ShouldReturnNonDeletedAccounts()
		{
			// Arrange
			var externalIdentityId = "external-identity-id";
			var userId = Guid.NewGuid();
			var user = new User { Id = userId };

			var accounts = new List<Account>
			{
				new Account { Id = Guid.NewGuid(), Name = "test", Owner = new User(), OwnerId = userId, IsDeleted = false },
				new Account { Id = Guid.NewGuid(), Name = "test", Owner = new User(), OwnerId = userId, IsDeleted = true }, // Should be ignored
                new Account { Id = Guid.NewGuid(), Name = "test", Owner = new User(), OwnerId = Guid.NewGuid(), IsDeleted = false } // Belongs to someone else
            }.AsQueryable();

			_userServiceMock.Setup(s => s.GetUserByExternalId(externalIdentityId)).Returns(user);
			_repositoryMock.Setup(r => r.All<Account>()).Returns(accounts);

			// Act
			// Note: This relies on AccountDto.AccountToAccountDto being correctly implemented.
			var result = _accountService.GetAccountsByOwnerId(externalIdentityId).ToList();

			// Assert
			Assert.That(result.Count, Is.EqualTo(1));
			// Assert.That(result.First().Id, Is.EqualTo(accounts.First().Id.ToString())); // Uncomment if Dto maps ID
		}

		#endregion

		#region UpdateAccountAsync Tests

		[Test]
		public async Task UpdateAccountAsync_WhenValidRequest_ShouldUpdatePropertiesAndSaveChanges()
		{
			// Arrange
			var accountId = Guid.NewGuid();
			var userId = Guid.NewGuid();
			var request = new AccountDto
			{
				Id = accountId.ToString(),
				Name = "Updated Name",
				Balance = 2000m,
				Description = "Updated Desc",
				Currency = 2,
				OwnerId = "ext-id"
			};

			var account = new Account { Id = accountId, Owner = new User(), OwnerId = userId, Name = "Old Name" };
			var user = new User { Id = userId };

			_repositoryMock.Setup(r => r.GetByIdAsync<Account>(accountId)).ReturnsAsync(account);
			_userServiceMock.Setup(s => s.GetUserByExternalId("ext-id")).Returns(user);

			// Act
			await _accountService.UpdateAccountAsync(request, "ext-id");

			// Assert
			Assert.That(account.Name, Is.EqualTo("Updated Name"));
			Assert.That(account.Balance, Is.EqualTo(2000m));
			Assert.That(account.Description, Is.EqualTo("Updated Desc"));
			_repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
		}

		#endregion
	}
}
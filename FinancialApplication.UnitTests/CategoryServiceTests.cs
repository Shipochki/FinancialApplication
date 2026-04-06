namespace FinancialApplication.UnitTests
{
	using Moq;
	using System.Linq.Expressions;
	using FinancialApplication.Application.Services.CategoryService;
	using FinancialApplication.Application.Common.Interfaces.Repository;
	using FinancialApplication.Application.Services.UserService;
	using FinancialApplication.Domain.Entities;

	[TestFixture]
	public class CategoryServiceTests
	{
		private Mock<IRepository> _repositoryMock;
		private Mock<IUserService> _userServiceMock;
		private CategoryService _categoryService;

		[SetUp]
		public void SetUp()
		{
			_repositoryMock = new Mock<IRepository>();
			_userServiceMock = new Mock<IUserService>();
			_categoryService = new CategoryService(_repositoryMock.Object, _userServiceMock.Object);
		}

		#region CreateCategoryByUserAsync Tests

		[Test]
		public async Task CreateCategoryByUserAsync_WhenUserExists_ShouldAddCategoryAndSaveChanges()
		{
			// Arrange
			var userExternalId = "external-user-id";
			var user = new User { Id = Guid.NewGuid() };
			var categoryDto = new CategoryDto
			{
				Name = "Dining",
				Description = "Eating out",
				Icon = "restaurant-icon"
			};

			_userServiceMock.Setup(s => s.GetUserByExternalId(userExternalId)).Returns(user);

			// Act
			await _categoryService.CreateCategoryByUserAsync(categoryDto, userExternalId);

			// Assert
			_repositoryMock.Verify(r => r.AddAsync(It.Is<Category>(c =>
				c.Name == categoryDto.Name &&
				c.Description == categoryDto.Description &&
				c.Icon == categoryDto.Icon &&
				c.IsGlobal == false &&
				c.OwnerId == user.Id)), Times.Once);
			_repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
		}

		[Test]
		public void CreateCategoryByUserAsync_WhenUserDoesNotExist_ShouldThrowArgumentNullException()
		{
			// Arrange
			var userExternalId = "invalid-user-id";
			var categoryDto = new CategoryDto() { Icon = "test", Name = "test" };

			_userServiceMock.Setup(s => s.GetUserByExternalId(userExternalId)).Returns((User)null);

			// Act & Assert
			var ex = Assert.ThrowsAsync<ArgumentNullException>(async () =>
				await _categoryService.CreateCategoryByUserAsync(categoryDto, userExternalId));
			Assert.That(ex.Message, Does.Contain("is missing"));
		}

		#endregion

		#region DeleteCategoryAsync Tests

		[Test]
		public async Task DeleteCategoryAsync_WhenCategoryExistsAndUserIsOwner_ShouldSetIsDeletedAndSaveChanges()
		{
			// Arrange
			var categoryId = Guid.NewGuid();
			var userExternalId = "external-user-id";
			var userId = Guid.NewGuid();

			var user = new User { Id = userId };
			var category = new Category { Id = categoryId, OwnerId = userId, Owner = user, IsDeleted = false, Icon = "test", Name = "test" };

			_repositoryMock.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Category, bool>>>()))
						   .ReturnsAsync(category);
			_userServiceMock.Setup(s => s.GetUserByExternalId(userExternalId)).Returns(user);

			// Act
			await _categoryService.DeleteCategoryAsync(categoryId.ToString(), userExternalId);

			// Assert
			Assert.That(category.IsDeleted, Is.True);
			_repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
		}

		[Test]
		public void DeleteCategoryAsync_WhenCategoryDoesNotExist_ShouldThrowArgumentNullException()
		{
			// Arrange
			var categoryId = Guid.NewGuid().ToString();

			_repositoryMock.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Category, bool>>>()))
						   .ReturnsAsync((Category)null);

			// Act & Assert
			var ex = Assert.ThrowsAsync<ArgumentNullException>(async () =>
				await _categoryService.DeleteCategoryAsync(categoryId, "any-user-id"));
			Assert.That(ex.Message, Does.Contain("is missing"));
		}

		[Test]
		public void DeleteCategoryAsync_WhenUserIsNotOwner_ShouldThrowArgumentException()
		{
			// Arrange
			var categoryId = Guid.NewGuid();
			var userExternalId = "external-user-id";

			var requestingUser = new User { Id = Guid.NewGuid() }; // Different ID
			var ownerUser = new User { Id = Guid.NewGuid() };
			var category = new Category { Id = categoryId, OwnerId = ownerUser.Id, Owner = ownerUser, Name = "test", Icon = "test" };

			_repositoryMock.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Category, bool>>>()))
						   .ReturnsAsync(category);
			_userServiceMock.Setup(s => s.GetUserByExternalId(userExternalId)).Returns(requestingUser);

			// Act & Assert
			var ex = Assert.ThrowsAsync<ArgumentException>(async () =>
				await _categoryService.DeleteCategoryAsync(categoryId.ToString(), userExternalId));
			Assert.That(ex.Message, Does.Contain("is not the owner of category"));
		}

		#endregion

		#region GetAllCategories Tests

		[Test]
		public void GetAllCategories_ShouldReturnGlobalAndUserOwnedCategories_ExcludingDeleted()
		{
			// Arrange
			var userExternalId = "external-user-id";
			var userId = Guid.NewGuid();
			var otherUserId = Guid.NewGuid();
			var user = new User { Id = userId };

			var categories = new List<Category>
			{
				new Category { Id = Guid.NewGuid(), IsGlobal = true, IsDeleted = false, Name = "Global 1", Icon = "test" },
				new Category { Id = Guid.NewGuid(), IsGlobal = false, OwnerId = userId, IsDeleted = false, Name = "User Owned", Icon = "test" },
				new Category { Id = Guid.NewGuid(), IsGlobal = false, OwnerId = userId, IsDeleted = true, Name = "Deleted Owned", Icon = "test" }, // Should be excluded
                new Category { Id = Guid.NewGuid(), IsGlobal = false, OwnerId = otherUserId, IsDeleted = false, Name = "Other User Owned", Icon = "test" } // Should be excluded
            }.AsQueryable();

			_userServiceMock.Setup(s => s.GetUserByExternalId(userExternalId)).Returns(user);
			_repositoryMock.Setup(r => r.All<Category>()).Returns(categories);

			// Act
			var result = _categoryService.GetAllCategories(userExternalId);

			// Assert
			Assert.That(result, Is.Not.Null);
			Assert.That(result.Count, Is.EqualTo(2)); // Expecting "Global 1" and "User Owned"
			Assert.That(result.Any(c => c.Name == "Global 1"), Is.True);
			Assert.That(result.Any(c => c.Name == "User Owned"), Is.True);
		}

		#endregion

		#region GetCategoryByIdAsync Tests

		[Test]
		public async Task GetCategoryByIdAsync_WhenValidAndUserIsOwner_ShouldReturnCategoryDto()
		{
			// Arrange
			var categoryId = Guid.NewGuid();
			var userExternalId = "external-user-id";
			var userId = Guid.NewGuid();

			var user = new User { Id = userId };
			var category = new Category
			{
				Id = categoryId,
				OwnerId = userId,
				Owner = user,
				Name = "Entertainment",
				Icon = "test"
			};

			_repositoryMock.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Category, bool>>>()))
						   .ReturnsAsync(category);
			_userServiceMock.Setup(s => s.GetUserByExternalId(userExternalId)).Returns(user);

			// Act
			var result = await _categoryService.GetCategoryByIdAsync(categoryId.ToString(), userExternalId);

			// Assert
			Assert.That(result, Is.Not.Null);
			Assert.That(result.Name, Is.EqualTo("Entertainment"));
			// Depending on how CategoryDto.CategoryDtoToCategory maps the ID, you might assert it here.
		}

		#endregion

		#region UpdateCategoryAsync Tests

		[Test]
		public async Task UpdateCategoryAsync_WhenValidAndUserIsOwner_ShouldUpdatePropertiesAndSaveChanges()
		{
			// Arrange
			var categoryDto = new CategoryDto
			{
				Id = Guid.NewGuid().ToString(),
				Name = "Updated Name",
				Description = "Updated Desc",
				Icon = "new-icon"
			};
			var userExternalId = "external-user-id";
			var userId = Guid.NewGuid();

			var user = new User { Id = userId };
			var category = new Category { Id = Guid.Parse(categoryDto.Id), OwnerId = userId, Owner = user, Name = "Old Name", Icon = "test" };

			_repositoryMock.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Category, bool>>>()))
						   .ReturnsAsync(category);
			_userServiceMock.Setup(s => s.GetUserByExternalId(userExternalId)).Returns(user);

			// Act
			await _categoryService.UpdateCategoryAsync(categoryDto, userExternalId);

			// Assert
			Assert.That(category.Name, Is.EqualTo("Updated Name"));
			Assert.That(category.Description, Is.EqualTo("Updated Desc"));
			Assert.That(category.Icon, Is.EqualTo("new-icon"));
			Assert.That(category.ModifiedOn, Is.Not.Null);
			_repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
		}

		#endregion
	}
}
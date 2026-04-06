namespace FinancialApplication.Infrastructure.Data.Seeding
{
	using FinancialApplication.Domain.Entities;

	public static class CategorySeeder
	{
		public static List<Category> GetSeedCategories()
		{
			return new List<Category>
			{
				new Category
				{
					Id = Guid.Parse("A1B2C3D4-E5F6-7A8B-9C0D-1E2F3A4B5C6D"),
					Name = "Groceries",
					Description = "Everyday food and household items purchased from supermarkets.",
					Icon = "shopping_cart",
					IsGlobal = true,
					OwnerId = null
				},
				new Category
				{
					Id = Guid.Parse("FFEEDDCC-BBAA-0099-8877-665544332211"),
					Name = "Utilities",
					Description = "Monthly bills like electricity, water, and internet.",
					Icon = "bolt",
					IsGlobal = true,
					OwnerId = null
				},
				new Category
				{
					Id = Guid.Parse("11223344-5566-7788-9900-AABBCCDDEEFF"),
					Name = "Housing",
					Description = "Rent or mortgage payments.",
					Icon = "home",
					IsGlobal = true,
					OwnerId = null
				},
				new Category
				{
					Id = Guid.Parse("F9E8D7C6-B5A4-3210-FEDC-BA9876543210"),
					Name = "Salary",
					Description = "Primary income received from employment.",
					Icon = "account_balance_wallet",
					IsGlobal = true,
					OwnerId = null
				},
				new Category
				{
					Id = Guid.Parse("99887766-5544-3322-1100-FFEEDDCCBBAA"),
					Name = "Side Hustle",
					Description = "Income generated from freelance work or secondary projects.",
					Icon = "trending_up",
					IsGlobal = true,
					OwnerId = null
				},
				new Category
				{
					Id = Guid.Parse("55AA66BB-77CC-88DD-99EE-00FF11AA22BB"),
					Name = "Transportation",
					Description = "Fuel, public transit passes, and vehicle maintenance.",
					Icon = "commute",
					IsGlobal = true,
					OwnerId = null
				}
			};
		}
	}
}
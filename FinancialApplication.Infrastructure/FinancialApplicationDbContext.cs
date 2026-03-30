namespace FinancialApplication.Infrastructure
{
    using FinancialApplication.Domain.Entities;
    using FinancialApplication.Infrastructure.EntityConfigurations;
    using Microsoft.EntityFrameworkCore;

    public class FinancialApplicationDbContext : DbContext
    {
        public FinancialApplicationDbContext(DbContextOptions<FinancialApplicationDbContext> options)
            : base(options)
        {
            Database.EnsureCreated();
        }

        public DbSet<Account> Accounts { get; set; }

        public DbSet<Budget> Budgets { get; set; }

        public DbSet<Category> Categories { get; set; }

        public DbSet<Transaction> Transactions { get; set; }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new AccountEntityConfiguration());
            modelBuilder.ApplyConfiguration(new BudgetEntityConfiguration());
            modelBuilder.ApplyConfiguration(new CategoryEntityConfiguration());
            modelBuilder.ApplyConfiguration(new TransactionEntityConfiguration());
            modelBuilder.ApplyConfiguration(new UserEntityConfiguration());

            base.OnModelCreating(modelBuilder);
        }
    }
}
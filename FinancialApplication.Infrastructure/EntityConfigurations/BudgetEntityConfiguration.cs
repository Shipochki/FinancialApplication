namespace FinancialApplication.Infrastructure.EntityConfigurations
{
    using FinancialApplication.Domain.Entities;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Metadata.Builders;
    using static FinancialApplication.Domain.Common.DataConstants.Budget;

    public class BudgetEntityConfiguration : IEntityTypeConfiguration<Budget>
    {
        public void Configure(EntityTypeBuilder<Budget> builder)
        {
            builder
                .HasOne(b => b.Category)
                .WithMany(c => c.Budgets)
                .HasForeignKey(b => b.CategoryId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            builder
                .HasOne(b => b.Account)
                .WithMany(a => a.Budgets)
                .HasForeignKey(b => b.AccountId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            builder
                .Property(b => b.Name)
                .HasMaxLength(MaxLengthName)
                .IsRequired();

            builder
                .Property(b => b.Description)
                .HasMaxLength(MaxLengthDescription)
                .IsRequired(false);
        }
    }
}

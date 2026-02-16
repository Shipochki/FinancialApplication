namespace FinancialApplication.Infrastructure.EntityConfigurations
{
    using FinancialApplication.Domain.Entities;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Metadata.Builders;
    using static FinancialApplication.Domain.Common.DataConstants.Transaction;

    public class TransactionEntityConfiguration : IEntityTypeConfiguration<Transaction>
    {
        public void Configure(EntityTypeBuilder<Transaction> builder)
        {
            builder
                .HasOne(t => t.Account)
                .WithMany(a => a.Transactions)
                .HasForeignKey(t => t.AccountId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .HasOne(t => t.Category)
                .WithMany()
                .HasForeignKey(t => t.CategoryId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .Property(t => t.Description)
                .IsRequired(false)
                .HasMaxLength(MaxLengthDescription);
        }
    }
}

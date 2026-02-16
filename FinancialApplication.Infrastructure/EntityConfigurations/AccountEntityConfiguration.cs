namespace FinancialApplication.Infrastructure.EntityConfigurations
{
    using FinancialApplication.Domain.Entities;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Metadata.Builders;
    using static FinancialApplication.Domain.Common.DataConstants.Account;

    public class AccountEntityConfiguration : IEntityTypeConfiguration<Account>
    {
        public void Configure(EntityTypeBuilder<Account> builder)
        {
            builder
                .HasOne(a => a.Owner)
                .WithMany()
                .HasForeignKey(a => a.OwnerId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .Property(a => a.Name)
                .IsRequired()
                .HasMaxLength(MaxLengthName);

            builder
                .Property(a => a.Description)
                .IsRequired(false)
                .HasMaxLength(MaxLengthDescription);
        }
    }
}

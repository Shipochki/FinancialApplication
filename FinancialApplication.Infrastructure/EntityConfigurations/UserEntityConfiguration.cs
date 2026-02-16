namespace FinancialApplication.Infrastructure.EntityConfigurations
{
    using FinancialApplication.Domain.Entities;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Metadata.Builders;
    using static FinancialApplication.Domain.Common.DataConstants.User;

    public class UserEntityConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder
                .Property(u => u.FirstName)
                .IsRequired(false)
                .HasMaxLength(MaxLengthName);

            builder
                .Property(u => u.LastName)
                .IsRequired(false)
                .HasMaxLength(MaxLengthName);

            builder
                .Property(u => u.Email)
                .IsRequired(false)
                .HasMaxLength(MaxLengthEmail);
        }
    }
}

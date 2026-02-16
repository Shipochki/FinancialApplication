namespace FinancialApplication.Infrastructure.EntityConfigurations
{
    using FinancialApplication.Domain.Entities;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Metadata.Builders;
    using static FinancialApplication.Domain.Common.DataConstants.Category;

    public class CategoryEntityConfiguration : IEntityTypeConfiguration<Category>
    {
        public void Configure(EntityTypeBuilder<Category> builder)
        {
            builder
                .HasOne(c => c.Owner)
                .WithMany(u => u.Categories)
                .HasForeignKey(c => c.OwnerId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.SetNull);

            builder
                .Property(c => c.Name)
                .IsRequired()
                .HasMaxLength(MaxLengthName);

            builder
                .Property(c => c.Description)
                .IsRequired(false)
                .HasMaxLength(MaxLengthDescription);
        }
    }
}

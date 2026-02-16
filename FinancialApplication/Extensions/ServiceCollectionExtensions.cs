namespace FinancialApplication.Api.Extensions
{
    using FinancialApplication.Infrastructure;
    using Microsoft.EntityFrameworkCore;

    public static class ServiceCollectionExtensions
    {
        public static void SetUpApplicationBuilder(this WebApplicationBuilder builder)
        {
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            builder.Services.AddDbContext<FinancialApplicationDbContext>(options =>
                options.UseSqlServer(connectionString));
        }
    }
}

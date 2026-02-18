namespace FinancialApplication.Api.Extensions
{
    using FinancialApplication.Application.Common.Interfaces.Repository;
    using FinancialApplication.Application.Services.Account;
    using FinancialApplication.Application.Services.User;
    using FinancialApplication.Infrastructure;
    using FinancialApplication.Infrastructure.Repository;
    using Microsoft.EntityFrameworkCore;

    public static class ServiceCollectionExtensions
    {
        public static void SetUpApplicationBuilder(this WebApplicationBuilder builder)
        {
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            builder.Services.AddDbContext<FinancialApplicationDbContext>(options =>
                options.UseSqlServer(connectionString));

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            builder.Services.ConfigureScopedServices();
        }

        private static IServiceCollection ConfigureScopedServices(this IServiceCollection services)
        { 
            // Register your scoped services here
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IRepository, Repository>();
            return services;
        }
    }
}

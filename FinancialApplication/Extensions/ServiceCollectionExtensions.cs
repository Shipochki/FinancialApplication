namespace FinancialApplication.Api.Extensions
{
    using FinancialApplication.Application.Common.Interfaces.Repository;
    using FinancialApplication.Application.Services.Account;
    using FinancialApplication.Application.Services.Transaction;
    using FinancialApplication.Application.Services.User;
    using FinancialApplication.Infrastructure;
    using FinancialApplication.Infrastructure.Repository;
    using Microsoft.AspNetCore.Authentication.JwtBearer;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Identity.Web;

    public static class ServiceCollectionExtensions
    {
        public static void SetUpApplicationBuilder(this WebApplicationBuilder builder)
        {
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            builder.Services.AddDbContext<FinancialApplicationDbContext>(options =>
                options.UseSqlServer(connectionString));

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            builder.Services.ConfigureScopedServices();
            builder.Services.ConfigureCorses();

            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("RequireApiScope", policy =>
                {
                    policy.RequireAuthenticatedUser();
                    // "scp" is the claim type for scopes in Entra ID tokens
                    policy.RequireClaim("scp", "access_as_user");
                });
            });
        }

        private static IServiceCollection ConfigureScopedServices(this IServiceCollection services)
        { 
            // Register your scoped services here
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<ITransactionService, TransactionService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IRepository, Repository>();
            return services;
        }

        private static IServiceCollection ConfigureCorses(this IServiceCollection service)
        {
            service.AddCors(options =>
            {
                options.AddPolicy("AllowOrigin",
                    builder => builder
                    .WithOrigins("https://localhost:4200")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());
            });

            return service;
        }
    }
}

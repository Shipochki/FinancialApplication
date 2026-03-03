namespace FinancialApplication.Api.Extensions
{
    using FinancialApplication.Application.Common.Interfaces.Repository;
    using FinancialApplication.Application.Services.AccountService;
    using FinancialApplication.Application.Services.TransactionService;
    using FinancialApplication.Application.Services.UserService;
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
            builder.Services.ConfigureAuthorization();
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

        private static IServiceCollection ConfigureCorses(this IServiceCollection services)
        {
            return services.AddCors(options =>
            {
                options.AddPolicy("AllowOrigin",
                    builder => builder
                    .WithOrigins("http://localhost:4200")
                    .AllowAnyMethod()
                    .AllowAnyHeader());
            });
        }

        private static IServiceCollection ConfigureAuthorization(this IServiceCollection services)
        {
            return services.AddAuthorization(options =>
            {
                options.AddPolicy("RequireApiScope", policy =>
                {
                    policy.RequireAuthenticatedUser();
                    policy.RequireAssertion(context =>
                    {
                        // .NET often renames "scp" to this long schema string. We check for both.
                        var scopeClaim = context.User.FindFirst("http://schemas.microsoft.com/identity/claims/scope")
                                      ?? context.User.FindFirst("scp");

                        // Check if the claim exists and contains our specific scope
                        return scopeClaim != null && scopeClaim.Value.Split(' ').Contains("access_as_user");
                    });
                });
            });
        }
    }
}

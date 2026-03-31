namespace FinancialApplication.Application.Services.AccountService
{
    using FinancialApplication.Application.Common.Interfaces.Repository;
    using FinancialApplication.Application.Services.UserService;
    using FinancialApplication.Domain.Entities;
    using FinancialApplication.Domain.Enums;

    public class AccountService : BaseService, IAccountService
    {
        private readonly IUserService _userService;

        public AccountService(IRepository repository,
            IUserService userService) : base(repository)
        {
            this._userService = userService;
        }

        public async Task CreateAccountAsync(AccountDto request)
        {
            User? owner = _userService.GetUserByExternalIdAsync(request.OwnerId);
            
            if (owner == null)
            {
                throw new Exception("When you try to create an Account, the owner was not found!");
            }

            Account account = new Account
            {
                Name = request.Name,
                Balance = request.Balance,
                Description = request.Description,
                Currency = (Currency)request.Currency,
                OwnerId = owner.Id,
                Owner = owner,
                CreatedOn = DateTime.UtcNow
            };

            await Repository.AddAsync(account);
            await Repository.SaveChangesAsync();
        }

        public Task DeleteAccountAsync(string accountId, string externalUserId)
        {
			Account? account = Repository.GetByIdAsync<Account>(Guid.Parse(accountId)).Result;

            if (account == null)
            {
                throw new Exception("Account not found");
            }

            User? user = _userService.GetUserByExternalIdAsync(externalUserId);

            if(user == null || account.OwnerId != user.Id)
            {
                throw new Exception("You are not the owner of this account");
			}

			account.IsDeleted = true;
            Repository.SaveChangesAsync();
            return Task.CompletedTask;
        }

        public Task<AccountDto> GetAccountByIdAsync(string accountId, string externalUserId)
        {
            Account? account = Repository.GetByIdAsync<Account>(Guid.Parse(accountId)).Result;

            if (account == null)
            {
                throw new Exception("Account not found");
            }

			User? user = _userService.GetUserByExternalIdAsync(externalUserId);

			if (user == null || account.OwnerId != user.Id)
			{
				throw new Exception("You are not the owner of this account");
			}

			AccountDto accountDto = new AccountDto
            {
                Id = account.Id.ToString(),
                Name = account.Name,
                Balance = account.Balance,
                Description = account.Description,
                Currency = (int)account.Currency,
                OwnerId = account.OwnerId.ToString()
            };

            return Task.FromResult(accountDto);
        }

        public IEnumerable<AccountDto> GetAccountsByOwnerId(string externalIdentityId)
        {
            User? user = _userService.GetUserByExternalIdAsync(externalIdentityId);

            return Repository
                .All<Account>()
                .Where(a => a.OwnerId == user.Id && !a.IsDeleted)
                .Select(AccountDto.AccountToAccountDto)
                .ToList();
        }

        public async Task UpdateAccountAsync(AccountDto request, string externalUserId)
        {
            Account? account = Repository.GetByIdAsync<Account>(Guid.Parse(request.Id)).Result;

            if (account == null)
            {
                throw new Exception("Account not found");
            }

			User? user = _userService.GetUserByExternalIdAsync(externalUserId);

			if (user == null || account.OwnerId != user.Id)
			{
				throw new Exception("You are not the owner of this account");
			}
			account.Name = request.Name;
            account.Balance = request.Balance;
            account.Description = request.Description;
            account.Currency = (Currency)request.Currency;
            account.ModifiedOn = DateTime.UtcNow;

            await Repository.SaveChangesAsync();
        }
    }
}

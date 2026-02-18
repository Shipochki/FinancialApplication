namespace FinancialApplication.Application
{
    using FinancialApplication.Application.Common.Interfaces.Repository;

    public abstract class BaseService
    {
        public readonly IRepository Repository;

        public BaseService(IRepository repository)
        {
            Repository = repository;
        }
    }
}

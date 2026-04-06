namespace FinancialApplication.Api.Filters
{
	using Microsoft.AspNetCore.Mvc;
	using Microsoft.AspNetCore.Mvc.Filters;

	public class GlobalExceptionHandler : IExceptionFilter
	{
		private readonly ILogger<GlobalExceptionHandler> _logger;

		public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
		{
			_logger = logger;
		}

		public void OnException(ExceptionContext context)
		{
			_logger.LogError(context.Exception, "An exception occurred in the controller: {Message}", context.Exception.Message);

			var statusCode = context.Exception switch
			{
				UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
				KeyNotFoundException => StatusCodes.Status404NotFound,
				ArgumentException => StatusCodes.Status400BadRequest,
				_ => StatusCodes.Status500InternalServerError
			};

			var problemDetails = new ProblemDetails
			{
				Status = statusCode,
				Title = "An error occurred while processing your request.",
				Type = context.Exception.GetType().Name,
				Detail = context.Exception.Message 
			};

			context.Result = new ObjectResult(problemDetails)
			{
				StatusCode = statusCode
			};

			context.ExceptionHandled = true;
		}
	}
}


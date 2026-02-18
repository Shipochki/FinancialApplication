namespace FinancialApplication.Api.DTOs.User
{
    using System.ComponentModel.DataAnnotations;
    using static FinancialApplication.Domain.Common.DataConstants.User;
    public class CreateUserDto
    {
        public string? ExternalIdentityId { get; set; }

        [MaxLength(MaxLengthName)]
        [MinLength(MinLengthName)]
        public string? FirstName { get; set; }

        [MaxLength(MaxLengthName)]
        [MinLength(MinLengthName)]
        public string? LastName { get; set; }

        [MaxLength(MaxLengthEmail)]
        [MinLength(MinLengthEmail)]
        public string? Email { get; set; }
    }
}

namespace FinancialApplication.Application.Services.User
{
    using System.ComponentModel.DataAnnotations;
    using static FinancialApplication.Domain.Common.DataConstants.User;
    using FinancialApplication.Domain.Entities;

    public class UserDto : BaseDto
    {
        public string? ExternalIdentityId { get; set; }

        [MaxLength(MaxLengthName)]
        [MinLength(MinLengthName)]
        public string? FirstName { get; set; }

        [MaxLength(MaxLengthName)]
        [MinLength(MinLengthName)]
        public string? LastName { get; set; }

        [MaxLength(MaxLengthName)]
        [MinLength(MinLengthName)]
        public string? Email { get; set; }

        public static UserDto UserToUserDto(User user)
        {
            return new UserDto
            {
                Id = user.Id.ToString(),
                ExternalIdentityId = user.ExternalIdentityId,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email
            };
        }
    }
}

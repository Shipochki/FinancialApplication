namespace FinancialApplication.Application.Services.User
{
    using FinancialApplication.Domain.Entities;

    public class UserDto : BaseDto
    {
        public string? ExternalIdentityId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
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

using System.Security.Claims;

public static class ClaimsPrincipalExtensions
{
    /// <summary>
    /// Retrieves the User ID from the ClaimsPrincipal claims.
    /// </summary>
    /// <param name="user">The current user's ClaimsPrincipal.</param>
    /// <returns>The user ID as a string, or null if no matching claim is found.</returns>
    public static string? GetUserId(this ClaimsPrincipal user)
    {
        if (user == null)
        {
            return null;
        }

        // ClaimTypes.NameIdentifier is the standard claim type for user IDs.
        // "sub" (Subject) is the standard JWT claim type for the user ID.
        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier) ??
                          user.FindFirst("sub") ??
                          user.FindFirst("id"); // Fallback for some custom setups

        return userIdClaim?.Value;
    }
}
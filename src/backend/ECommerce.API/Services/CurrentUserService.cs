using System.Security.Claims;
using ECommerce.Application.Common.Interfaces;

namespace ECommerce.API.Services;

public sealed class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
{
    public string? Username => httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Name);

    public string? Role => httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Role);

    public Guid? UserId
    {
        get
        {
            var raw = httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Guid.TryParse(raw, out var id) ? id : null;
        }
    }
}

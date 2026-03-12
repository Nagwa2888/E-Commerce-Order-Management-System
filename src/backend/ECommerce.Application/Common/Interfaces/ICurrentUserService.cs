namespace ECommerce.Application.Common.Interfaces;

public interface ICurrentUserService
{
    string? Username { get; }
    string? Role { get; }
    Guid? UserId { get; }
}

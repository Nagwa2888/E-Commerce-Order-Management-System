using ECommerce.Domain.Common;
using ECommerce.Domain.Enums;

namespace ECommerce.Domain.Entities;

public sealed class User : BaseEntity
{
    public required string Username { get; set; }
    public required string PasswordHash { get; set; }
    public required UserRole Role { get; set; }
}

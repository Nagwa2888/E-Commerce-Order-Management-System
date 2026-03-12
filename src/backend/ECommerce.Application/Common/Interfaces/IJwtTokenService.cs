using ECommerce.Domain.Entities;

namespace ECommerce.Application.Common.Interfaces;

public interface IJwtTokenService
{
    string GenerateToken(User user);
}

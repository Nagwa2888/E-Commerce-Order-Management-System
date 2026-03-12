using ECommerce.Domain.Entities;

namespace ECommerce.Application.Common.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByUsernameAsync(string username, CancellationToken cancellationToken);
}

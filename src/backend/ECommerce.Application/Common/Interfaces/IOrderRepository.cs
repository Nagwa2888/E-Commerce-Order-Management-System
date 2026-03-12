using ECommerce.Domain.Entities;

namespace ECommerce.Application.Common.Interfaces;

public interface IOrderRepository
{
    Task AddAsync(Order order, CancellationToken cancellationToken);
    Task<Order?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken);
}

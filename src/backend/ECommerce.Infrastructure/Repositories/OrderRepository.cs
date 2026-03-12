using ECommerce.Application.Common.Interfaces;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Repositories;

public sealed class OrderRepository(AppDbContext dbContext) : IOrderRepository
{
    public Task AddAsync(Order order, CancellationToken cancellationToken)
    {
        return dbContext.Orders.AddAsync(order, cancellationToken).AsTask();
    }

    public Task<Order?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken)
    {
        return dbContext.Orders
            .Include(o => o.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);
    }
}

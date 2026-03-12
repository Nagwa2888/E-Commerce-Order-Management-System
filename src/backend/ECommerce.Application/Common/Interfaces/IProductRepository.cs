using ECommerce.Application.Common.Models;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Common.Interfaces;

public interface IProductRepository
{
    Task<PagedResult<Product>> GetPagedAsync(ProductListQueryRequest request, CancellationToken cancellationToken);
    Task<Product?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task AddAsync(Product product, CancellationToken cancellationToken);
    void Update(Product product);
}

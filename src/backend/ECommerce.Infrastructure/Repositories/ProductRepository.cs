using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.Common.Models;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Repositories;

public sealed class ProductRepository(AppDbContext dbContext) : IProductRepository
{
    public async Task<PagedResult<Product>> GetPagedAsync(ProductListQueryRequest request, CancellationToken cancellationToken)
    {
        var query = dbContext.Products.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.Trim().ToLowerInvariant();
            query = query.Where(p => p.Name.ToLower().Contains(search) || p.Description.ToLower().Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(request.Category))
        {
            var category = request.Category.Trim().ToLowerInvariant();
            query = query.Where(p => p.Category.ToLower() == category);
        }

        var sortBy = request.SortBy?.Trim().ToLowerInvariant();
        var isDesc = string.Equals(request.SortDirection, "desc", StringComparison.OrdinalIgnoreCase);

        query = sortBy switch
        {
            "price" => isDesc ? query.OrderByDescending(p => p.Price) : query.OrderBy(p => p.Price),
            "category" => isDesc ? query.OrderByDescending(p => p.Category) : query.OrderBy(p => p.Category),
            _ => isDesc ? query.OrderByDescending(p => p.Name) : query.OrderBy(p => p.Name)
        };

        var pageNumber = request.PageNumber <= 0 ? 1 : request.PageNumber;
        var pageSize = request.PageSize is <= 0 or > 100 ? 10 : request.PageSize;

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);

        return new PagedResult<Product>(items, totalCount, pageNumber, pageSize);
    }

    public Task<Product?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return dbContext.Products.FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    public Task AddAsync(Product product, CancellationToken cancellationToken)
    {
        return dbContext.Products.AddAsync(product, cancellationToken).AsTask();
    }

    public void Update(Product product)
    {
        dbContext.Products.Update(product);
    }
}

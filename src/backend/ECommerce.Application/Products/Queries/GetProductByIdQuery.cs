using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.Common.Models;
using MediatR;

namespace ECommerce.Application.Products.Queries;

public sealed record GetProductByIdQuery(Guid ProductId) : IRequest<ProductDto>;

public sealed class GetProductByIdQueryHandler(IProductRepository productRepository, ICacheService cacheService)
    : IRequestHandler<GetProductByIdQuery, ProductDto>
{
    public async Task<ProductDto> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        var cacheKey = $"product:{request.ProductId}";

        return await cacheService.GetOrCreateAsync(cacheKey, async () =>
        {
            var product = await productRepository.GetByIdAsync(request.ProductId, cancellationToken)
                ?? throw new KeyNotFoundException("Product not found.");

            return new ProductDto(product.Id, product.Name, product.Category, product.Description, product.Price, product.StockQuantity);
        }, TimeSpan.FromMinutes(5), cancellationToken);
    }
}

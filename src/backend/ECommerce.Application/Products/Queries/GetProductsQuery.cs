using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.Common.Models;
using MediatR;

namespace ECommerce.Application.Products.Queries;

public sealed record GetProductsQuery(ProductListQueryRequest Request) : IRequest<PagedResult<ProductDto>>;

public sealed class GetProductsQueryHandler(IProductRepository productRepository, ICacheService cacheService)
    : IRequestHandler<GetProductsQuery, PagedResult<ProductDto>>
{
    public async Task<PagedResult<ProductDto>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
    {
        var cacheKey = $"products:p={request.Request.PageNumber}:s={request.Request.PageSize}:q={request.Request.Search}:c={request.Request.Category}:sb={request.Request.SortBy}:sd={request.Request.SortDirection}";

        return await cacheService.GetOrCreateAsync(cacheKey, async () =>
        {
            var pagedProducts = await productRepository.GetPagedAsync(request.Request, cancellationToken);
            var productDtos = pagedProducts.Items
                .Select(p => new ProductDto(p.Id, p.Name, p.Category, p.Description, p.Price, p.StockQuantity))
                .ToArray();

            return new PagedResult<ProductDto>(productDtos, pagedProducts.TotalCount, pagedProducts.PageNumber, pagedProducts.PageSize);
        }, TimeSpan.FromMinutes(3), cancellationToken);
    }
}

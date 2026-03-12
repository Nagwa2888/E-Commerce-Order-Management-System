using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.Common.Models;
using MediatR;

namespace ECommerce.Application.Products.Commands;

public sealed record UpdateProductCommand(Guid ProductId, string Name, string Category, string Description, decimal Price, int StockQuantity) : IRequest<ProductDto>;

public sealed class UpdateProductCommandHandler(IProductRepository productRepository, IUnitOfWork unitOfWork, ICacheService cacheService)
    : IRequestHandler<UpdateProductCommand, ProductDto>
{
    public async Task<ProductDto> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        if (request.Price <= 0 || request.StockQuantity < 0)
        {
            throw new ArgumentException("Invalid price or stock quantity.");
        }

        var product = await productRepository.GetByIdAsync(request.ProductId, cancellationToken)
            ?? throw new KeyNotFoundException("Product not found.");

        product.Name = request.Name.Trim();
        product.Category = request.Category.Trim();
        product.Description = request.Description.Trim();
        product.Price = request.Price;
        product.StockQuantity = request.StockQuantity;
        product.UpdatedAtUtc = DateTime.UtcNow;

        productRepository.Update(product);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        await cacheService.RemoveByPrefixAsync("products:", cancellationToken);
        await cacheService.RemoveAsync($"product:{request.ProductId}", cancellationToken);

        return new ProductDto(product.Id, product.Name, product.Category, product.Description, product.Price, product.StockQuantity);
    }
}

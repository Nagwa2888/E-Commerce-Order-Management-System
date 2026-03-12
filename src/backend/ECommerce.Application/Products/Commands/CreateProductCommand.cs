using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.Common.Models;
using ECommerce.Domain.Entities;
using MediatR;

namespace ECommerce.Application.Products.Commands;

public sealed record CreateProductCommand(string Name, string Category, string Description, decimal Price, int StockQuantity) : IRequest<ProductDto>;

public sealed class CreateProductCommandHandler(IProductRepository productRepository, IUnitOfWork unitOfWork, ICacheService cacheService)
    : IRequestHandler<CreateProductCommand, ProductDto>
{
    public async Task<ProductDto> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        if (request.Price <= 0 || request.StockQuantity < 0)
        {
            throw new ArgumentException("Invalid price or stock quantity.");
        }

        var product = new Product
        {
            Name = request.Name.Trim(),
            Category = request.Category.Trim(),
            Description = request.Description.Trim(),
            Price = request.Price,
            StockQuantity = request.StockQuantity
        };

        await productRepository.AddAsync(product, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        await cacheService.RemoveByPrefixAsync("products:", cancellationToken);

        return new ProductDto(product.Id, product.Name, product.Category, product.Description, product.Price, product.StockQuantity);
    }
}

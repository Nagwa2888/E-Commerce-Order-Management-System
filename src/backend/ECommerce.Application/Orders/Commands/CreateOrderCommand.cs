using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.Common.Models;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Enums;
using MediatR;

namespace ECommerce.Application.Orders.Commands;

public sealed record CreateOrderCommand(CreateOrderRequest Request) : IRequest<OrderResponse>;

public sealed class CreateOrderCommandHandler(
    IOrderRepository orderRepository,
    IProductRepository productRepository,
    IUnitOfWork unitOfWork,
    ICurrentUserService currentUserService,
    ICacheService cacheService,
    INotificationService notificationService)
    : IRequestHandler<CreateOrderCommand, OrderResponse>
{
    public async Task<OrderResponse> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        if (currentUserService.UserId is null || string.IsNullOrWhiteSpace(currentUserService.Username))
        {
            throw new UnauthorizedAccessException("User context is not available.");
        }

        if (request.Request.Items.Count == 0)
        {
            throw new ArgumentException("Order must include at least one item.");
        }

        if (request.Request.DiscountPercentage < 0 || request.Request.DiscountPercentage > 100)
        {
            throw new ArgumentException("Discount must be between 0 and 100.");
        }

        await unitOfWork.BeginTransactionAsync(cancellationToken);
        try
        {
            var order = new Order
            {
                UserId = currentUserService.UserId.Value,
                DiscountPercentage = request.Request.DiscountPercentage,
                Status = OrderStatus.Confirmed
            };

            decimal subtotal = 0;
            var responseItems = new List<OrderItemResponse>();

            foreach (var item in request.Request.Items)
            {
                if (item.Quantity <= 0)
                {
                    throw new ArgumentException("Item quantity must be greater than zero.");
                }

                var product = await productRepository.GetByIdAsync(item.ProductId, cancellationToken)
                    ?? throw new KeyNotFoundException($"Product '{item.ProductId}' not found.");

                if (product.StockQuantity < item.Quantity)
                {
                    throw new InvalidOperationException($"Insufficient stock for '{product.Name}'. Requested={item.Quantity}, Available={product.StockQuantity}.");
                }

                product.StockQuantity -= item.Quantity;
                product.UpdatedAtUtc = DateTime.UtcNow;
                productRepository.Update(product);

                var lineTotal = product.Price * item.Quantity;
                subtotal += lineTotal;

                order.Items.Add(new OrderItem
                {
                    ProductId = product.Id,
                    Quantity = item.Quantity,
                    UnitPrice = product.Price,
                    LineTotal = lineTotal
                });

                responseItems.Add(new OrderItemResponse(product.Id, product.Name, item.Quantity, product.Price, lineTotal));
            }

            order.Subtotal = subtotal;
            order.DiscountAmount = subtotal * (request.Request.DiscountPercentage / 100);
            order.TotalAmount = subtotal - order.DiscountAmount;

            await orderRepository.AddAsync(order, cancellationToken);
            await unitOfWork.SaveChangesAsync(cancellationToken);
            await unitOfWork.CommitTransactionAsync(cancellationToken);

            await cacheService.RemoveByPrefixAsync("products:", cancellationToken);
            foreach (var i in responseItems)
            {
                await cacheService.RemoveAsync($"product:{i.ProductId}", cancellationToken);
            }

            await notificationService.NotifySuccessAsync($"Order {order.Id} completed for {currentUserService.Username}.", cancellationToken);

            return new OrderResponse(
                order.Id,
                currentUserService.Username,
                order.Subtotal,
                order.DiscountPercentage,
                order.DiscountAmount,
                order.TotalAmount,
                responseItems,
                order.Status.ToString());
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync(cancellationToken);
            throw;
        }
    }
}

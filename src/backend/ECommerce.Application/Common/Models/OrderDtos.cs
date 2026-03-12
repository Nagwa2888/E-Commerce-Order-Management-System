namespace ECommerce.Application.Common.Models;

public sealed record CreateOrderItemRequest(Guid ProductId, int Quantity);

public sealed record CreateOrderRequest(IReadOnlyCollection<CreateOrderItemRequest> Items, decimal DiscountPercentage);

public sealed record OrderItemResponse(Guid ProductId, string ProductName, int Quantity, decimal UnitPrice, decimal LineTotal);

public sealed record OrderResponse(Guid OrderId, string Username, decimal Subtotal, decimal DiscountPercentage, decimal DiscountAmount, decimal TotalAmount, IReadOnlyCollection<OrderItemResponse> Items, string Status);

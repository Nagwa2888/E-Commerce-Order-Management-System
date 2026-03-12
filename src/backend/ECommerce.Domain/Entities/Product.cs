using ECommerce.Domain.Common;

namespace ECommerce.Domain.Entities;

public sealed class Product : BaseEntity
{
    public required string Name { get; set; }
    public required string Category { get; set; }
    public required string Description { get; set; }
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
}

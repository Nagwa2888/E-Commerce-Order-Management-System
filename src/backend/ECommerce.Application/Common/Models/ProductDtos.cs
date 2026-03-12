namespace ECommerce.Application.Common.Models;

public sealed record ProductDto(Guid Id, string Name, string Category, string Description, decimal Price, int StockQuantity);

public sealed record ProductListQueryRequest(int PageNumber = 1, int PageSize = 10, string? Search = null, string? Category = null, string? SortBy = "name", string? SortDirection = "asc");

using ECommerce.Application.Common.Models;
using ECommerce.Application.Products.Commands;
using ECommerce.Application.Products.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/products")]
[Authorize(Policy = "CustomerOrAdmin")]
public sealed class ProductsController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetProducts([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null,
        [FromQuery] string? category = null, [FromQuery] string? sortBy = "name", [FromQuery] string? sortDirection = "asc", CancellationToken cancellationToken = default)
    {
        var request = new ProductListQueryRequest(pageNumber, pageSize, search, category, sortBy, sortDirection);
        var result = await sender.Send(new GetProductsQuery(request), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await sender.Send(new GetProductByIdQuery(id), cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> Create([FromBody] CreateProductCommand command, CancellationToken cancellationToken)
    {
        var result = await sender.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProductRequest request, CancellationToken cancellationToken)
    {
        var result = await sender.Send(new UpdateProductCommand(id, request.Name, request.Category, request.Description, request.Price, request.StockQuantity), cancellationToken);
        return Ok(result);
    }

    public sealed record UpdateProductRequest(string Name, string Category, string Description, decimal Price, int StockQuantity);
}

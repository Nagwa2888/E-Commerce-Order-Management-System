using ECommerce.Application.Common.Models;
using ECommerce.Application.Orders.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/orders")]
[Authorize(Policy = "CustomerOrAdmin")]
public sealed class OrdersController(ISender sender) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request, CancellationToken cancellationToken)
    {
        var response = await sender.Send(new CreateOrderCommand(request), cancellationToken);
        return Ok(response);
    }
}

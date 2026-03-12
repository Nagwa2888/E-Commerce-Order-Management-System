using ECommerce.API.Hubs;
using ECommerce.Application.Common.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace ECommerce.API.Services;

public sealed class SignalRNotificationService(IHubContext<NotificationHub> hubContext) : INotificationService
{
    public Task NotifyInfoAsync(string message, CancellationToken cancellationToken)
        => SendAsync("info", message, cancellationToken);

    public Task NotifySuccessAsync(string message, CancellationToken cancellationToken)
        => SendAsync("success", message, cancellationToken);

    public Task NotifyWarningAsync(string message, CancellationToken cancellationToken)
        => SendAsync("warning", message, cancellationToken);

    public Task NotifyErrorAsync(string message, CancellationToken cancellationToken)
        => SendAsync("error", message, cancellationToken);

    private Task SendAsync(string type, string message, CancellationToken cancellationToken)
    {
        return hubContext.Clients.All.SendAsync("notification", new
        {
            id = Guid.NewGuid(),
            type,
            message,
            createdAtUtc = DateTime.UtcNow
        }, cancellationToken);
    }
}

namespace ECommerce.Application.Common.Interfaces;

public interface INotificationService
{
    Task NotifyInfoAsync(string message, CancellationToken cancellationToken);
    Task NotifySuccessAsync(string message, CancellationToken cancellationToken);
    Task NotifyWarningAsync(string message, CancellationToken cancellationToken);
    Task NotifyErrorAsync(string message, CancellationToken cancellationToken);
}

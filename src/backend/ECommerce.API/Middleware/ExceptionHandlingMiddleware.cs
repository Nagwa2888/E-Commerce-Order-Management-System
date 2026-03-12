using ECommerce.Application.Common.Interfaces;
using System.Text.Json;

namespace ECommerce.API.Middleware;

public sealed class ExceptionHandlingMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context, INotificationService notificationService)
    {
        try
        {
            await next(context);
        }
        catch (UnauthorizedAccessException ex)
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            context.Response.ContentType = "application/json";
            await notificationService.NotifyWarningAsync(ex.Message, context.RequestAborted);
            await context.Response.WriteAsync(JsonSerializer.Serialize(new { error = ex.Message }));
        }
        catch (KeyNotFoundException ex)
        {
            context.Response.StatusCode = StatusCodes.Status404NotFound;
            context.Response.ContentType = "application/json";
            await notificationService.NotifyInfoAsync(ex.Message, context.RequestAborted);
            await context.Response.WriteAsync(JsonSerializer.Serialize(new { error = ex.Message }));
        }
        catch (ArgumentException ex)
        {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            context.Response.ContentType = "application/json";
            await notificationService.NotifyWarningAsync(ex.Message, context.RequestAborted);
            await context.Response.WriteAsync(JsonSerializer.Serialize(new { error = ex.Message }));
        }
        catch (InvalidOperationException ex)
        {
            context.Response.StatusCode = StatusCodes.Status409Conflict;
            context.Response.ContentType = "application/json";
            await notificationService.NotifyErrorAsync(ex.Message, context.RequestAborted);
            await context.Response.WriteAsync(JsonSerializer.Serialize(new { error = ex.Message }));
        }
        catch (Exception ex)
        {
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            context.Response.ContentType = "application/json";
            await notificationService.NotifyErrorAsync("A server error occurred.", context.RequestAborted);
            await context.Response.WriteAsync(JsonSerializer.Serialize(new { error = "Unexpected server error.", details = ex.Message }));
        }
    }
}

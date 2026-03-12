namespace ECommerce.Application.Common.Models;

public sealed record AuthResponse(string Token, string Username, string Role);

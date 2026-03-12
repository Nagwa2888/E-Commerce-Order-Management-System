using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.Common.Models;
using MediatR;

namespace ECommerce.Application.Auth.Commands;

public sealed record LoginCommand(string Username, string Password) : IRequest<AuthResponse>;

public sealed class LoginCommandHandler(
    IUserRepository userRepository,
    IPasswordHasher passwordHasher,
    IJwtTokenService jwtTokenService,
    INotificationService notificationService) : IRequestHandler<LoginCommand, AuthResponse>
{
    public async Task<AuthResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetByUsernameAsync(request.Username, cancellationToken);
        if (user is null || !passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            await notificationService.NotifyWarningAsync($"Authentication failed for user '{request.Username}'.", cancellationToken);
            throw new UnauthorizedAccessException("Invalid username or password.");
        }

        var token = jwtTokenService.GenerateToken(user);
        await notificationService.NotifySuccessAsync($"{user.Username} logged in successfully.", cancellationToken);

        return new AuthResponse(token, user.Username, user.Role.ToString());
    }
}

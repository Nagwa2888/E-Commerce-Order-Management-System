namespace ECommerce.Application.Common.Interfaces;

public interface ICacheService
{
    Task<T> GetOrCreateAsync<T>(string key, Func<Task<T>> factory, TimeSpan ttl, CancellationToken cancellationToken);
    Task RemoveAsync(string key, CancellationToken cancellationToken);
    Task RemoveByPrefixAsync(string prefix, CancellationToken cancellationToken);
}

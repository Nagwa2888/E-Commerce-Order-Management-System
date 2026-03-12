using System.Collections.Concurrent;
using System.Text.Json;
using ECommerce.Application.Common.Interfaces;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;

namespace ECommerce.Infrastructure.Caching;

public sealed class HybridCacheService(IMemoryCache memoryCache, IDistributedCache distributedCache) : ICacheService
{
    private static readonly ConcurrentDictionary<string, byte> Keys = new();

    public async Task<T> GetOrCreateAsync<T>(string key, Func<Task<T>> factory, TimeSpan ttl, CancellationToken cancellationToken)
    {
        if (memoryCache.TryGetValue<T>(key, out var memoryValue) && memoryValue is not null)
        {
            return memoryValue;
        }

        var redisValue = await distributedCache.GetStringAsync(key, cancellationToken);
        if (!string.IsNullOrWhiteSpace(redisValue))
        {
            var fromRedis = JsonSerializer.Deserialize<T>(redisValue);
            if (fromRedis is not null)
            {
                memoryCache.Set(key, fromRedis, ttl);
                Keys.TryAdd(key, 0);
                return fromRedis;
            }
        }

        var value = await factory();
        memoryCache.Set(key, value, ttl);
        await distributedCache.SetStringAsync(key, JsonSerializer.Serialize(value), new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = ttl
        }, cancellationToken);
        Keys.TryAdd(key, 0);

        return value;
    }

    public async Task RemoveAsync(string key, CancellationToken cancellationToken)
    {
        memoryCache.Remove(key);
        await distributedCache.RemoveAsync(key, cancellationToken);
        Keys.TryRemove(key, out _);
    }

    public async Task RemoveByPrefixAsync(string prefix, CancellationToken cancellationToken)
    {
        var keysToDelete = Keys.Keys.Where(k => k.StartsWith(prefix, StringComparison.OrdinalIgnoreCase)).ToArray();
        foreach (var key in keysToDelete)
        {
            await RemoveAsync(key, cancellationToken);
        }
    }
}

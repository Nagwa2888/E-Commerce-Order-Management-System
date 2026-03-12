using System.Security.Cryptography;
using System.Text;
using ECommerce.Application.Common.Interfaces;

namespace ECommerce.Infrastructure.Security;

public sealed class PasswordHasher : IPasswordHasher
{
    public string Hash(string value)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(value));
        return Convert.ToBase64String(bytes);
    }

    public bool Verify(string value, string hash)
    {
        return Hash(value) == hash;
    }
}

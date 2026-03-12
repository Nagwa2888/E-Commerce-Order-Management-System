using ECommerce.Domain.Entities;
using ECommerce.Domain.Enums;
using ECommerce.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Persistence;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext dbContext, CancellationToken cancellationToken)
    {
        await dbContext.Database.EnsureCreatedAsync(cancellationToken);

        if (!await dbContext.Users.AnyAsync(cancellationToken))
        {
            var hasher = new PasswordHasher();
            dbContext.Users.AddRange(
                new User { Username = "admin", PasswordHash = hasher.Hash("Admin123!"), Role = UserRole.Admin },
                new User { Username = "customer", PasswordHash = hasher.Hash("Customer123!"), Role = UserRole.Customer });
        }

        if (!await dbContext.Products.AnyAsync(cancellationToken))
        {
            dbContext.Products.AddRange(
                new Product { Name = "Laptop Pro 14", Category = "Electronics", Description = "High performance laptop", Price = 1499.99m, StockQuantity = 15 },
                new Product { Name = "Ergo Chair", Category = "Furniture", Description = "Ergonomic office chair", Price = 249.99m, StockQuantity = 40 },
                new Product { Name = "Noise Cancelling Headphones", Category = "Electronics", Description = "Wireless ANC headphones", Price = 199.99m, StockQuantity = 60 },
                new Product { Name = "Mechanical Keyboard", Category = "Accessories", Description = "RGB mechanical keyboard", Price = 129.99m, StockQuantity = 80 });
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}

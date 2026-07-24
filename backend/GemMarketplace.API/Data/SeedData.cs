using GemMarketplace.API.Models;
using Microsoft.AspNetCore.Identity;

namespace GemMarketplace.API.Data;

public static class SeedData
{
    public static async Task SeedAsync(ApplicationDbContext db, RoleManager<IdentityRole> roleManager, UserManager<ApplicationUser> userManager)
    {
        // Roles
        foreach (var role in new[] { "Admin", "Customer" })
        {
            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole(role));
        }

        // Admin user
        var adminEmail = "admin@ceylongems.local";
        var adminPassword = "Admin@123456";
        var admin = await userManager.FindByEmailAsync(adminEmail);

        if (admin is null)
        {
            admin = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                FullName = "Site Administrator",
                Country = "Sri Lanka",
                EmailConfirmed = true
            };

            var createResult = await userManager.CreateAsync(admin, adminPassword);
            if (!createResult.Succeeded)
                throw new InvalidOperationException($"Failed to seed admin user: {string.Join(", ", createResult.Errors.Select(e => e.Description))}");
        }
        else
        {
            admin.FullName = "Site Administrator";
            admin.Country = "Sri Lanka";
            admin.EmailConfirmed = true;
            admin.UserName = adminEmail;
            admin.Email = adminEmail;
            await userManager.UpdateAsync(admin);

            var removePasswordResult = await userManager.RemovePasswordAsync(admin);
            if (!removePasswordResult.Succeeded)
                throw new InvalidOperationException($"Failed to clear admin password: {string.Join(", ", removePasswordResult.Errors.Select(e => e.Description))}");

            var addPasswordResult = await userManager.AddPasswordAsync(admin, adminPassword);
            if (!addPasswordResult.Succeeded)
                throw new InvalidOperationException($"Failed to reset admin password: {string.Join(", ", addPasswordResult.Errors.Select(e => e.Description))}");
        }

        if (!await userManager.IsInRoleAsync(admin, "Admin"))
        {
            await userManager.AddToRoleAsync(admin, "Admin");
        }

        // Categories
        if (!db.Categories.Any())
        {
            var categories = new[]
            {
                new Category { Name = "Blue Sapphire", Slug = "blue-sapphire" },
                new Category { Name = "Pink Sapphire", Slug = "pink-sapphire" },
                new Category { Name = "Padparadscha", Slug = "padparadscha" },
                new Category { Name = "Ruby", Slug = "ruby" },
                new Category { Name = "Spinel", Slug = "spinel" },
                new Category { Name = "Alexandrite", Slug = "alexandrite" },
                new Category { Name = "Green Sapphire", Slug = "green-sapphire" },
                new Category { Name = "Catseye", Slug = "catseye" },
            };
            db.Categories.AddRange(categories);
            await db.SaveChangesAsync();

            var blue = categories.First(c => c.Slug == "blue-sapphire");
            var pink = categories.First(c => c.Slug == "pink-sapphire");

            db.Gems.AddRange(
                new Gem
                {
                    Code = "CGH-1001",
                    Name = "Royal Blue Sapphire",
                    Slug = "royal-blue-sapphire-1001",
                    Description = "A richly saturated, eye-clean Ceylon blue sapphire with exceptional cornflower hue.",
                    CategoryId = blue.Id,
                    WeightCarats = 5.42m,
                    Origin = "Ceylon",
                    Shape = "Oval",
                    Cut = "Brilliant",
                    Treatment = "Unheated",
                    Color = "Royal Blue",
                    CertificateNumber = "GIA-2201123",
                    CertificateAuthority = "GIA",
                    Price = 18500m,
                    IsFeatured = true
                },
                new Gem
                {
                    Code = "CGH-1002",
                    Name = "Hot Pink Sapphire",
                    Slug = "hot-pink-sapphire-1002",
                    Description = "Vivid hot-pink Ceylon sapphire, cushion cut, heated for clarity enhancement.",
                    CategoryId = pink.Id,
                    WeightCarats = 10.03m,
                    Origin = "Ceylon",
                    Shape = "Cushion",
                    Cut = "Step",
                    Treatment = "Heated",
                    Color = "Pink",
                    Price = 28000m,
                    IsFeatured = true
                }
            );
            await db.SaveChangesAsync();
        }
    }
}

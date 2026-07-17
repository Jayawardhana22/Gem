using GemMarketplace.API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace GemMarketplace.API.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Gem> Gems => Set<Gem>();
    public DbSet<GemImage> GemImages => Set<GemImage>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Gem>()
            .HasIndex(g => g.Slug).IsUnique();
        builder.Entity<Gem>()
            .HasIndex(g => g.Code).IsUnique();
        builder.Entity<Gem>()
            .Property(g => g.Price).HasColumnType("decimal(18,2)");
        builder.Entity<Gem>()
            .Property(g => g.WeightCarats).HasColumnType("decimal(10,2)");
        builder.Entity<Gem>()
            .HasOne(g => g.Category).WithMany(c => c.Gems).HasForeignKey(g => g.CategoryId);

        builder.Entity<GemImage>()
            .HasOne(i => i.Gem).WithMany(g => g.Images).HasForeignKey(i => i.GemId);

        builder.Entity<Category>()
            .HasIndex(c => c.Slug).IsUnique();

        builder.Entity<CartItem>()
            .HasOne(c => c.User).WithMany(u => u.CartItems).HasForeignKey(c => c.UserId);
        builder.Entity<CartItem>()
            .HasOne(c => c.Gem).WithMany().HasForeignKey(c => c.GemId);

        builder.Entity<Order>()
            .Property(o => o.Subtotal).HasColumnType("decimal(18,2)");
        builder.Entity<Order>()
            .Property(o => o.ShippingFee).HasColumnType("decimal(18,2)");
        builder.Entity<Order>()
            .Property(o => o.Total).HasColumnType("decimal(18,2)");
        builder.Entity<Order>()
            .HasOne(o => o.User).WithMany(u => u.Orders).HasForeignKey(o => o.UserId);

        builder.Entity<OrderItem>()
            .Property(i => i.UnitPrice).HasColumnType("decimal(18,2)");
        builder.Entity<OrderItem>()
            .HasOne(i => i.Order).WithMany(o => o.Items).HasForeignKey(i => i.OrderId);
        builder.Entity<OrderItem>()
            .HasOne(i => i.Gem).WithMany().HasForeignKey(i => i.GemId);
    }
}

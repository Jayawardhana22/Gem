using GemMarketplace.API.Data;
using GemMarketplace.API.DTOs;
using GemMarketplace.API.Models;
using GemMarketplace.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GemMarketplace.API.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IFileStorageService _fileStorage;

    public AdminController(ApplicationDbContext db, IFileStorageService fileStorage)
    {
        _db = db;
        _fileStorage = fileStorage;
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult> Dashboard()
    {
        var totalGems = await _db.Gems.CountAsync();
        var available = await _db.Gems.CountAsync(g => g.Status == GemStatus.Available);
        var sold = await _db.Gems.CountAsync(g => g.Status == GemStatus.Sold);
        var totalRevenue = await _db.Orders.Where(o => o.Status == OrderStatus.Paid).SumAsync(o => o.Total);
        var pendingOrders = await _db.Orders.CountAsync(o => o.Status == OrderStatus.PendingPayment || o.Status == OrderStatus.Paid || o.Status == OrderStatus.Processing);
        var recentOrders = await _db.Orders.Include(o => o.Items)
            .OrderByDescending(o => o.CreatedAt).Take(5)
            .Select(o => new { o.Id, o.OrderNumber, o.Total, o.Status, o.CreatedAt })
            .ToListAsync();

        return Ok(new { totalGems, available, sold, totalRevenue, pendingOrders, recentOrders });
    }

    // ---- Gem management ----

    [HttpGet("gems")]
    public async Task<ActionResult> GetAllGems(int page = 1, int pageSize = 20)
    {
        var query = _db.Gems.Include(g => g.Category).Include(g => g.Images).OrderByDescending(g => g.CreatedAt);
        var total = await query.CountAsync();
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize)
            .Select(g => new GemListItemDto(g.Id, g.Code, g.Name, g.Slug, g.Price, g.WeightCarats, g.Color, g.Shape,
                g.Status, g.IsFeatured, g.Images.Select(i => i.Url).FirstOrDefault(), g.Category!.Name))
            .ToListAsync();
        return Ok(new { items, total });
    }

    [HttpPost("gems")]
    public async Task<ActionResult> CreateGem(GemUpsertDto dto)
    {
        var gem = new Gem
        {
            Code = dto.Code,
            Name = dto.Name,
            Slug = Slugify(dto.Name, dto.Code),
            Description = dto.Description,
            CategoryId = dto.CategoryId,
            WeightCarats = dto.WeightCarats,
            Origin = dto.Origin,
            Shape = dto.Shape,
            Cut = dto.Cut,
            Treatment = dto.Treatment,
            Color = dto.Color,
            CertificateNumber = dto.CertificateNumber,
            CertificateAuthority = dto.CertificateAuthority,
            Price = dto.Price,
            Status = dto.Status,
            IsFeatured = dto.IsFeatured
        };
        _db.Gems.Add(gem);
        await _db.SaveChangesAsync();
        return Ok(new { gem.Id, gem.Slug });
    }

    [HttpPut("gems/{id}")]
    public async Task<ActionResult> UpdateGem(int id, GemUpsertDto dto)
    {
        var gem = await _db.Gems.FindAsync(id);
        if (gem is null) return NotFound();

        gem.Code = dto.Code;
        gem.Name = dto.Name;
        gem.Description = dto.Description;
        gem.CategoryId = dto.CategoryId;
        gem.WeightCarats = dto.WeightCarats;
        gem.Origin = dto.Origin;
        gem.Shape = dto.Shape;
        gem.Cut = dto.Cut;
        gem.Treatment = dto.Treatment;
        gem.Color = dto.Color;
        gem.CertificateNumber = dto.CertificateNumber;
        gem.CertificateAuthority = dto.CertificateAuthority;
        gem.Price = dto.Price;
        gem.Status = dto.Status;
        gem.IsFeatured = dto.IsFeatured;
        gem.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("gems/{id}")]
    public async Task<ActionResult> DeleteGem(int id)
    {
        var gem = await _db.Gems.FindAsync(id);
        if (gem is null) return NotFound();
        _db.Gems.Remove(gem);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("gems/{id}/images")]
    [RequestSizeLimit(20_000_000)]
    public async Task<ActionResult> UploadImage(int id, [FromForm] IFormFile file, [FromForm] bool isPrimary = false)
    {
        var gem = await _db.Gems.FindAsync(id);
        if (gem is null) return NotFound();

        var url = await _fileStorage.SaveImageAsync(file, "gems");

        if (isPrimary)
        {
            var existingPrimaries = await _db.GemImages.Where(i => i.GemId == id && i.IsPrimary).ToListAsync();
            existingPrimaries.ForEach(i => i.IsPrimary = false);
        }

        var image = new GemImage { GemId = id, Url = url, IsPrimary = isPrimary };
        _db.GemImages.Add(image);
        await _db.SaveChangesAsync();

        return Ok(new { image.Id, image.Url, image.IsPrimary });
    }

    [HttpDelete("images/{imageId}")]
    public async Task<ActionResult> DeleteImage(int imageId)
    {
        var image = await _db.GemImages.FindAsync(imageId);
        if (image is null) return NotFound();
        _db.GemImages.Remove(image);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    // ---- Order management ----

    [HttpGet("orders")]
    public async Task<ActionResult> GetAllOrders(OrderStatus? status, int page = 1, int pageSize = 20)
    {
        var query = _db.Orders.Include(o => o.Items).Include(o => o.User).AsQueryable();
        if (status.HasValue) query = query.Where(o => o.Status == status);
        query = query.OrderByDescending(o => o.CreatedAt);

        var total = await query.CountAsync();
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize)
            .Select(o => new
            {
                o.Id, o.OrderNumber, o.Total, o.Status, o.CreatedAt,
                CustomerName = o.User!.FullName, CustomerEmail = o.User.Email,
                ItemCount = o.Items.Count
            })
            .ToListAsync();

        return Ok(new { items, total });
    }

    [HttpPut("orders/{id}/status")]
    public async Task<ActionResult> UpdateOrderStatus(int id, [FromBody] OrderStatus status)
    {
        var order = await _db.Orders.FindAsync(id);
        if (order is null) return NotFound();
        order.Status = status;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static string Slugify(string name, string code)
    {
        var baseSlug = name.ToLowerInvariant().Replace(" ", "-");
        return $"{baseSlug}-{code.ToLowerInvariant().Replace(" ", "")}";
    }
}

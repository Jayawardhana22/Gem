using GemMarketplace.API.Data;
using GemMarketplace.API.DTOs;
using GemMarketplace.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GemMarketplace.API.Controllers;

[ApiController]
[Route("api/gems")]
public class GemsController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    public GemsController(ApplicationDbContext db) => _db = db;

    // GET /api/gems?category=blue-sapphire&minPrice=100&maxPrice=5000&minCarat=1&maxCarat=10&sort=price_asc&search=ruby&page=1&pageSize=12
    [HttpGet]
    public async Task<ActionResult> GetAll(
        string? category, decimal? minPrice, decimal? maxPrice,
        decimal? minCarat, decimal? maxCarat, string? sort, string? search,
        bool? featuredOnly, int page = 1, int pageSize = 12)
    {
        var query = _db.Gems.Include(g => g.Category).Include(g => g.Images)
            .Where(g => g.Status != GemStatus.Sold)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(category))
            query = query.Where(g => g.Category!.Slug == category);
        if (minPrice.HasValue) query = query.Where(g => g.Price >= minPrice);
        if (maxPrice.HasValue) query = query.Where(g => g.Price <= maxPrice);
        if (minCarat.HasValue) query = query.Where(g => g.WeightCarats >= minCarat);
        if (maxCarat.HasValue) query = query.Where(g => g.WeightCarats <= maxCarat);
        if (featuredOnly == true) query = query.Where(g => g.IsFeatured);
        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchTerm = search.Trim().ToLower();
            query = query.Where(g => g.Name.ToLower().Contains(searchTerm) || 
                                     g.Code.ToLower().Contains(searchTerm) || 
                                     g.Color.ToLower().Contains(searchTerm));
        }

        query = sort switch
        {
            "price_asc" => query.OrderBy(g => g.Price),
            "price_desc" => query.OrderByDescending(g => g.Price),
            "carat_desc" => query.OrderByDescending(g => g.WeightCarats),
            "newest" => query.OrderByDescending(g => g.CreatedAt),
            _ => query.OrderByDescending(g => g.IsFeatured).ThenByDescending(g => g.CreatedAt)
        };

        var total = await query.CountAsync();
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize)
            .Select(g => new GemListItemDto(
                g.Id, g.Code, g.Name, g.Slug, g.Price, g.WeightCarats, g.Color, g.Shape, g.Status,
                g.IsFeatured, g.Images.Where(i => i.IsPrimary).Select(i => i.Url).FirstOrDefault()
                    ?? g.Images.Select(i => i.Url).FirstOrDefault(),
                g.Category!.Name))
            .ToListAsync();

        return Ok(new { items, total, page, pageSize });
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<GemDetailDto>> GetBySlug(string slug)
    {
        var g = await _db.Gems.Include(x => x.Category).Include(x => x.Images)
            .FirstOrDefaultAsync(x => x.Slug == slug);
        if (g is null) return NotFound();

        return Ok(new GemDetailDto(
            g.Id, g.Code, g.Name, g.Slug, g.Description, g.Price, g.WeightCarats, g.Origin,
            g.Shape, g.Cut, g.Treatment, g.Color, g.CertificateNumber, g.CertificateAuthority,
            g.Status, g.IsFeatured, g.Category!.Name, g.CategoryId,
            g.Images.OrderBy(i => i.SortOrder).Select(i => i.Url).ToList()));
    }
}

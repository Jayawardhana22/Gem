using GemMarketplace.API.Data;
using GemMarketplace.API.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GemMarketplace.API.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    public CategoriesController(ApplicationDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<CategoryDto>>> GetAll()
    {
        var categories = await _db.Categories
            .Select(c => new CategoryDto(c.Id, c.Name, c.Slug, c.IconImageUrl, c.Gems.Count))
            .ToListAsync();
        return Ok(categories);
    }
}

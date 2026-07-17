using System.Security.Claims;
using GemMarketplace.API.Data;
using GemMarketplace.API.DTOs;
using GemMarketplace.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GemMarketplace.API.Controllers;

[ApiController]
[Route("api/cart")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    public CartController(ApplicationDbContext db) => _db = db;

    private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<ActionResult<CartSummaryDto>> GetCart()
    {
        var items = await _db.CartItems.Include(c => c.Gem).ThenInclude(g => g!.Images)
            .Where(c => c.UserId == UserId)
            .Select(c => new CartItemDto(
                c.Id, c.GemId, c.Gem!.Name, c.Gem.Code,
                c.Gem.Images.Where(i => i.IsPrimary).Select(i => i.Url).FirstOrDefault() ?? c.Gem.Images.Select(i => i.Url).FirstOrDefault(),
                c.Gem.Price, c.Quantity, c.Gem.Price * c.Quantity))
            .ToListAsync();

        return Ok(new CartSummaryDto(items, items.Sum(i => i.LineTotal)));
    }

    [HttpPost]
    public async Task<ActionResult> AddToCart(AddToCartDto dto)
    {
        var gem = await _db.Gems.FindAsync(dto.GemId);
        if (gem is null || gem.Status != GemStatus.Available)
            return BadRequest(new { message = "This gem is not available for purchase." });

        // Gems are typically one-of-a-kind; cap quantity at 1 unless you remove this for bulk items.
        var existing = await _db.CartItems.FirstOrDefaultAsync(c => c.UserId == UserId && c.GemId == dto.GemId);
        if (existing is not null)
        {
            existing.Quantity = dto.Quantity;
        }
        else
        {
            _db.CartItems.Add(new CartItem { UserId = UserId, GemId = dto.GemId, Quantity = dto.Quantity });
        }
        await _db.SaveChangesAsync();
        return Ok(new { message = "Added to cart." });
    }

    [HttpDelete("{cartItemId}")]
    public async Task<ActionResult> RemoveFromCart(int cartItemId)
    {
        var item = await _db.CartItems.FirstOrDefaultAsync(c => c.Id == cartItemId && c.UserId == UserId);
        if (item is null) return NotFound();
        _db.CartItems.Remove(item);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

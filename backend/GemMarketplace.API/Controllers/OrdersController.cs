using System.Security.Claims;
using GemMarketplace.API.Data;
using GemMarketplace.API.DTOs;
using GemMarketplace.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GemMarketplace.API.Controllers;

[ApiController]
[Route("api/orders")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    public OrdersController(ApplicationDbContext db) => _db = db;

    private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    // Creates a PendingPayment order snapshot from the current cart. Payment is completed via /api/payments.
    [HttpPost]
    public async Task<ActionResult<OrderDto>> CreateOrder(CreateOrderDto dto)
    {
        var cartItems = await _db.CartItems.Include(c => c.Gem)
            .Where(c => c.UserId == UserId).ToListAsync();

        if (!cartItems.Any())
            return BadRequest(new { message = "Your cart is empty." });

        foreach (var item in cartItems)
        {
            if (item.Gem!.Status != GemStatus.Available)
                return BadRequest(new { message = $"{item.Gem.Name} ({item.Gem.Code}) is no longer available." });
        }

        var subtotal = cartItems.Sum(c => c.Gem!.Price * c.Quantity);
        const decimal shippingFee = 150m; // flat international insured shipping fee for high-value gems

        var order = new Order
        {
            OrderNumber = $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Random.Shared.Next(1000, 9999)}",
            UserId = UserId,
            Subtotal = subtotal,
            ShippingFee = shippingFee,
            Total = subtotal + shippingFee,
            Status = OrderStatus.PendingPayment,
            ShippingName = dto.Shipping.ShippingName,
            ShippingAddress = dto.Shipping.ShippingAddress,
            ShippingCity = dto.Shipping.ShippingCity,
            ShippingCountry = dto.Shipping.ShippingCountry,
            ShippingPostalCode = dto.Shipping.ShippingPostalCode,
            ContactPhone = dto.Shipping.ContactPhone,
        };

        foreach (var c in cartItems)
        {
            order.Items.Add(new OrderItem
            {
                GemId = c.GemId,
                GemName = c.Gem!.Name,
                GemCode = c.Gem.Code,
                UnitPrice = c.Gem.Price,
                Quantity = c.Quantity
            });
            c.Gem.Status = GemStatus.Pending; // reserve the gem while payment is in progress
        }

        _db.Orders.Add(order);
        _db.CartItems.RemoveRange(cartItems);
        await _db.SaveChangesAsync();

        return Ok(ToDto(order));
    }

    [HttpGet]
    public async Task<ActionResult<List<OrderDto>>> GetMyOrders()
    {
        var orders = await _db.Orders.Include(o => o.Items)
            .Where(o => o.UserId == UserId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
        return Ok(orders.Select(ToDto));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<OrderDto>> GetById(int id)
    {
        var order = await _db.Orders.Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id && o.UserId == UserId);
        if (order is null) return NotFound();
        return Ok(ToDto(order));
    }

    private static OrderDto ToDto(Order o) => new(
        o.Id, o.OrderNumber, o.Subtotal, o.ShippingFee, o.Total, o.Status, o.CreatedAt,
        o.Items.Select(i => new OrderItemDto(i.GemId, i.GemName, i.GemCode, i.UnitPrice, i.Quantity, i.UnitPrice * i.Quantity)).ToList());
}

using GemMarketplace.API.Data;
using GemMarketplace.API.DTOs;
using GemMarketplace.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace GemMarketplace.API.Controllers;

[ApiController]
[Route("api/payments")]
public class PaymentsController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IConfiguration _config;

    public PaymentsController(ApplicationDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
        StripeConfiguration.ApiKey = config["Stripe:SecretKey"];
    }

    // Creates a Stripe PaymentIntent for an existing order and returns the client secret
    // for use with Stripe Elements on the frontend.
    [Authorize]
    [HttpPost("create-intent/{orderId}")]
    public async Task<ActionResult<CreatePaymentIntentResponse>> CreateIntent(int orderId)
    {
        var order = await _db.Orders.FirstOrDefaultAsync(o => o.Id == orderId);
        if (order is null) return NotFound();
        if (order.Status != OrderStatus.PendingPayment) return BadRequest(new { message = "Order is not awaiting payment." });

        var service = new PaymentIntentService();
        var intent = await service.CreateAsync(new PaymentIntentCreateOptions
        {
            Amount = (long)(order.Total * 100), // smallest currency unit
            Currency = "usd",
            Metadata = new Dictionary<string, string> { { "orderId", order.Id.ToString() }, { "orderNumber", order.OrderNumber } }
        });

        order.StripePaymentIntentId = intent.Id;
        await _db.SaveChangesAsync();

        return Ok(new CreatePaymentIntentResponse(intent.ClientSecret!, _config["Stripe:PublishableKey"]!, order.Id));
    }

    // Stripe calls this webhook when a payment succeeds. Configure the endpoint + secret in your Stripe dashboard.
    [HttpPost("webhook")]
    public async Task<IActionResult> Webhook()
    {
        var json = await new StreamReader(Request.Body).ReadToEndAsync();
        Event stripeEvent;
        try
        {
            stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], _config["Stripe:WebhookSecret"]);
        }
        catch (StripeException)
        {
            return BadRequest();
        }

        if (stripeEvent.Type == "payment_intent.succeeded")
        {
            var intent = (PaymentIntent)stripeEvent.Data.Object;
            var order = await _db.Orders.Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.StripePaymentIntentId == intent.Id);

            if (order is not null && order.Status == OrderStatus.PendingPayment)
            {
                order.Status = OrderStatus.Paid;
                order.PaidAt = DateTime.UtcNow;

                foreach (var item in order.Items)
                {
                    var gem = await _db.Gems.FindAsync(item.GemId);
                    if (gem is not null) gem.Status = GemStatus.Sold;
                }
                await _db.SaveChangesAsync();
            }
        }

        return Ok();
    }
}

namespace GemMarketplace.API.Models;

public class OrderItem
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public Order? Order { get; set; }
    public int GemId { get; set; }
    public Gem? Gem { get; set; }

    // Snapshot fields so order history stays accurate even if the gem listing changes later
    public string GemName { get; set; } = string.Empty;
    public string GemCode { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
}

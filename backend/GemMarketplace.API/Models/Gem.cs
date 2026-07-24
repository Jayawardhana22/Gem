namespace GemMarketplace.API.Models;

public enum GemStatus
{
    Available,
    Pending,
    Sold
}

public class Gem
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;          // e.g. CGH954
    public string Name { get; set; } = string.Empty;           // e.g. "Pink Sapphire"
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public int CategoryId { get; set; }
    public Category? Category { get; set; }

    public decimal WeightCarats { get; set; }
    public string Origin { get; set; } = "Ceylon";
    public string Shape { get; set; } = string.Empty;          // Cushion, Oval, Round...
    public string Cut { get; set; } = string.Empty;            // Step, Brilliant...
    public string Treatment { get; set; } = string.Empty;      // Heated, Unheated...
    public string Color { get; set; } = string.Empty;
    public string? CertificateNumber { get; set; }
    public string? CertificateAuthority { get; set; }
    public string? CertificateFileUrl { get; set; }

    public decimal Price { get; set; }
    public GemStatus Status { get; set; } = GemStatus.Available;
    public bool IsFeatured { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public ICollection<GemImage> Images { get; set; } = new List<GemImage>();
}

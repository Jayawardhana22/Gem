namespace GemMarketplace.API.Models;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;       // e.g. "Blue Sapphire"
    public string Slug { get; set; } = string.Empty;        // e.g. "blue-sapphire"
    public string? Description { get; set; }
    public string? IconImageUrl { get; set; }

    public ICollection<Gem> Gems { get; set; } = new List<Gem>();
}

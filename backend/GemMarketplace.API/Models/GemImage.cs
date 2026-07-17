namespace GemMarketplace.API.Models;

public class GemImage
{
    public int Id { get; set; }
    public int GemId { get; set; }
    public Gem? Gem { get; set; }
    public string Url { get; set; } = string.Empty;
    public bool IsPrimary { get; set; }
    public int SortOrder { get; set; }
}

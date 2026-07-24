using GemMarketplace.API.Models;
using System.ComponentModel.DataAnnotations;

namespace GemMarketplace.API.DTOs;

public record GemListItemDto(
    int Id, string Code, string Name, string Slug, decimal Price,
    decimal WeightCarats, string Color, string Shape, GemStatus Status,
    bool IsFeatured, string? PrimaryImageUrl, string CategoryName);

public record GemDetailDto(
    int Id, string Code, string Name, string Slug, string Description,
    decimal Price, decimal WeightCarats, string Origin, string Shape, string Cut,
    string Treatment, string Color, string? CertificateNumber, string? CertificateAuthority,
    string? CertificateFileUrl, GemStatus Status, bool IsFeatured, string CategoryName, int CategoryId,
    List<string> ImageUrls);

public class GemUpsertDto
{
    [Required]
    [StringLength(50, MinimumLength = 1)]
    public string Code { get; set; } = string.Empty;
    
    [Required]
    [StringLength(200, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [StringLength(5000)]
    public string Description { get; set; } = string.Empty;
    
    [Range(1, int.MaxValue)]
    public int CategoryId { get; set; }
    
    [Range(0.01, 10000)]
    public decimal WeightCarats { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Origin { get; set; } = "Ceylon";
    
    [Required]
    [StringLength(50)]
    public string Shape { get; set; } = string.Empty;
    
    [Required]
    [StringLength(50)]
    public string Cut { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string Treatment { get; set; } = string.Empty;
    
    [Required]
    [StringLength(50)]
    public string Color { get; set; } = string.Empty;
    
    [StringLength(100)]
    public string? CertificateNumber { get; set; }
    
    [StringLength(100)]
    public string? CertificateAuthority { get; set; }

    [StringLength(500)]
    public string? CertificateFileUrl { get; set; }
    
    [Range(0.01, 1000000)]
    public decimal Price { get; set; }
    
    public GemStatus Status { get; set; } = GemStatus.Available;
    public bool IsFeatured { get; set; }
}

public record CategoryDto(int Id, string Name, string Slug, string? IconImageUrl, int GemCount);

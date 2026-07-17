namespace GemMarketplace.API.DTOs;

using System.ComponentModel.DataAnnotations;

public record AddToCartDto(
    [Range(1, int.MaxValue, ErrorMessage = "Gem ID must be valid")]
    int GemId, 
    
    [Range(1, 10, ErrorMessage = "Quantity must be between 1 and 10")]
    int Quantity);

public record CartItemDto(int Id, int GemId, string GemName, string GemCode, string? ImageUrl, decimal UnitPrice, int Quantity, decimal LineTotal);
public record CartSummaryDto(List<CartItemDto> Items, decimal Subtotal);

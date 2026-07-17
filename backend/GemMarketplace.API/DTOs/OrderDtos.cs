using GemMarketplace.API.Models;
using System.ComponentModel.DataAnnotations;

namespace GemMarketplace.API.DTOs;

public record ShippingInfoDto(
    [Required]
    [StringLength(100, MinimumLength = 2)]
    string ShippingName, 
    
    [Required]
    [StringLength(200, MinimumLength = 5)]
    string ShippingAddress, 
    
    [Required]
    [StringLength(100, MinimumLength = 2)]
    string ShippingCity,
    
    [Required]
    [StringLength(100, MinimumLength = 2)]
    string ShippingCountry, 
    
    [Required]
    [StringLength(20, MinimumLength = 3)]
    string ShippingPostalCode, 
    
    [Required]
    [Phone(ErrorMessage = "Invalid phone number")]
    string ContactPhone);

public record CreateOrderDto(ShippingInfoDto Shipping);

public record OrderItemDto(int GemId, string GemName, string GemCode, decimal UnitPrice, int Quantity, decimal LineTotal);

public record OrderDto(int Id, string OrderNumber, decimal Subtotal, decimal ShippingFee, decimal Total,
    OrderStatus Status, DateTime CreatedAt, List<OrderItemDto> Items);

public record CreatePaymentIntentResponse(string ClientSecret, string PublishableKey, int OrderId);

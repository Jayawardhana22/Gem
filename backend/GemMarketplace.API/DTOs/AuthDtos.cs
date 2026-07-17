namespace GemMarketplace.API.DTOs;

using System.ComponentModel.DataAnnotations;

public record RegisterDto(
    [Required(ErrorMessage = "Full name is required")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Full name must be between 2 and 100 characters")]
    string FullName, 
    
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email address")]
    string Email, 
    
    [Required(ErrorMessage = "Password is required")]
    [StringLength(128, MinimumLength = 12, ErrorMessage = "Password must be at least 12 characters")]
    string Password, 
    
    [Required(ErrorMessage = "Country is required")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Country must be between 2 and 100 characters")]
    string Country);

public record LoginDto(
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email address")]
    string Email, 
    
    [Required(ErrorMessage = "Password is required")]
    string Password);

public record AuthResponseDto(string Token, string Email, string FullName, string[] Roles, DateTime ExpiresAt);

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using GemMarketplace.API.Models;
using Microsoft.IdentityModel.Tokens;

namespace GemMarketplace.API.Services;

public class TokenService
{
    private readonly IConfiguration _config;
    public TokenService(IConfiguration config) => _config = config;

    public (string token, DateTime expiresAt) CreateToken(ApplicationUser user, IList<string> roles)
    {
        var jwt = _config.GetSection("Jwt");
        var expiry = DateTime.UtcNow.AddMinutes(double.Parse(jwt["ExpiryMinutes"] ?? "120"));

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Email, user.Email ?? string.Empty),
            new(ClaimTypes.Name, user.FullName)
        };
        claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: jwt["Issuer"],
            audience: jwt["Audience"],
            claims: claims,
            expires: expiry,
            signingCredentials: creds);

        return (new JwtSecurityTokenHandler().WriteToken(token), expiry);
    }
}

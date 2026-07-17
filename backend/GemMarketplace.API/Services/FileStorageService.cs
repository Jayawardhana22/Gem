namespace GemMarketplace.API.Services;

public class FileStorageService : IFileStorageService
{
    private readonly IWebHostEnvironment _env;
    private readonly IHttpContextAccessor _http;

    public FileStorageService(IWebHostEnvironment env, IHttpContextAccessor http)
    {
        _env = env;
        _http = http;
    }

    public async Task<string> SaveImageAsync(IFormFile file, string subFolder)
    {
        var allowedExt = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExt.Contains(ext))
            throw new InvalidOperationException("Unsupported image format.");

        var folder = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads", subFolder);
        Directory.CreateDirectory(folder);

        var fileName = $"{Guid.NewGuid()}{ext}";
        var fullPath = Path.Combine(folder, fileName);

        using var stream = new FileStream(fullPath, FileMode.Create);
        await file.CopyToAsync(stream);

        var request = _http.HttpContext?.Request;
        var baseUrl = request is null ? "" : $"{request.Scheme}://{request.Host}";
        return $"{baseUrl}/uploads/{subFolder}/{fileName}";
    }
}

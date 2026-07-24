namespace GemMarketplace.API.Services;

public interface IFileStorageService
{
    Task<string> SaveImageAsync(IFormFile file, string subFolder);
    Task<string> SaveCertificateAsync(IFormFile file, string subFolder);
}

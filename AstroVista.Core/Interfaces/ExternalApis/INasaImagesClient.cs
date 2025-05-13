using AstroVista.Core.Models;

namespace AstroVista.Core.Interfaces.ExternalApis
{
    public interface INasaImagesClient
    {
        Task<NasaImageSearchResult?> SearchImagesAsync(CancellationToken cancellationToken, string query,
            string? mediaType = null, int? page = 1, int? pageSize = 100);
        Task<NasaLatestImagesCollection?> GetLatestImagesAsync(CancellationToken cancellationToken, int page = 1, int pageSize = 100);
    }
}
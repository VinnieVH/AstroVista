using AstroVista.Core.Models;

namespace AstroVista.Core.Interfaces.ExternalApis
{
    public interface INasaImagesClient
    {
        Task<NasaImageSearchResult?> SearchImagesAsync(CancellationToken cancellationToken, string query,
            string? mediaType = null, int? page = 1, int? pageSize = 100);
        Task<NasaAssetManifest?> GetAssetManifestAsync(string nasaId, CancellationToken cancellationToken);
        Task<NasaMetadataLocation?> GetMetadataLocationAsync(string nasaId, CancellationToken cancellationToken);
        Task<NasaCaptionsLocation?> GetCaptionsLocationAsync(string nasaId, CancellationToken cancellationToken);
        Task<NasaAlbumContents?> GetAlbumContentsAsync(CancellationToken cancellationToken, string albumName, int page = 1);
    }
}
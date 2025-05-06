using AstroVista.Core.Models;

namespace AstroVista.Core.Interfaces.ExternalApis;

public interface INasaApodClient
{
    Task<AstronomyPicture?> GetApodAsync( CancellationToken cancellationToken,DateTime? date = null, bool? thumbs = null);
}
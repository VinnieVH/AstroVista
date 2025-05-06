using AstroVista.Application.Nasa.Queries;
using AstroVista.Core.Interfaces.ExternalApis;
using AstroVista.Core.Models;

namespace AstroVista.Application.Nasa.Handlers;

public class GetApodQueryHandler
{
    public static Task<AstronomyPicture?> HandleAsync(
        GetApodQuery query,
        INasaApodClient apodClient,
        CancellationToken cancellation)
    {
        return apodClient.GetApodAsync(cancellation, query.Date, query.ThumbsEnabled);
    }
}
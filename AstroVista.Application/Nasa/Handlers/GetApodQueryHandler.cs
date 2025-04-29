using AstroVista.Application.Nasa.Queries;
using AstroVista.Core.Interfaces.ExternalApis;
using AstroVista.Core.Models;

namespace AstroVista.Infrastructure.Handlers.Queries.Nasa;

public class GetApodQueryHandler
{
    public static Task<AstronomyPicture?> HandleAsync(
        GetApodQuery query,
        INasaApodClient apodClient,
        CancellationToken cancellation)
    {
        return apodClient.GetApodAsync(query.Date, query.ThumbsEnabled);
    }
}
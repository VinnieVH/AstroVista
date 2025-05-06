using AstroVista.Application.Nasa.Queries;
using AstroVista.Application.Nasa.Responses;
using AstroVista.Core.Interfaces.ExternalApis;

namespace AstroVista.Application.Nasa.Handlers;

public class GetLatestImagesQueryHandler
{
    public async Task<GetLatestImagesResponse?> HandleAsync(
        GetLatestImagesQuery query, 
        INasaImagesClient nasaImagesClient,
        CancellationToken cancellationToken)
    {
        var result = await nasaImagesClient.GetLatestImagesAsync(
            cancellationToken,
            query.Page,
            query.PageSize);

        return new GetLatestImagesResponse(result);
    }
}
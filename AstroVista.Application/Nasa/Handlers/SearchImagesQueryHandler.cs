using AstroVista.Application.Nasa.Queries;
using AstroVista.Application.Nasa.Responses;
using AstroVista.Core.Interfaces.ExternalApis;

namespace AstroVista.Application.Nasa.Handlers;

public class SearchImagesQueryHandler
{
    public async Task<SearchImagesResponse?> HandleAsync(
        SearchImagesQuery searchImagesQuery, 
        INasaImagesClient nasaImagesClient,
        CancellationToken cancellationToken)
    {
        var result = await nasaImagesClient.SearchImagesAsync(cancellationToken, searchImagesQuery.Query, searchImagesQuery.MediaType, searchImagesQuery.Page, searchImagesQuery.PageSize);

        return new SearchImagesResponse(result);
    }
}
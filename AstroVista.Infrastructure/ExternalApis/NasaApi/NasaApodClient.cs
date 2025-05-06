using AstroVista.Core.Interfaces.ExternalApis;
using AstroVista.Core.Models;
using AstroVista.Infrastructure.ExternalApis.NasaApi.Models;
using Microsoft.Extensions.Configuration;

namespace AstroVista.Infrastructure.ExternalApis.NasaApi;

public class NasaApodClient(HttpClient httpClient, IConfiguration configuration)
    : NasaApiBase(httpClient, configuration), INasaApodClient
{
    public async Task<AstronomyPicture?> GetApodAsync(CancellationToken cancellationToken, DateTime? date = null, bool? thumbs = null)
    {
        var parameters = new Dictionary<string, string>();
        
        if (date.HasValue)
        {
            parameters["date"] = date.Value.ToString("yyyy-MM-dd");
        }
        
        if (thumbs.HasValue)
        {
            parameters["thumbs"] = thumbs.Value.ToString().ToLower();
        }
        
        var apiResponse = await GetAsync<ApodApiResponse>("planetary/apod", parameters);
        if (apiResponse == null) return null;
        
        return new AstronomyPicture(
            apiResponse.Title,
            apiResponse.Explanation,
            apiResponse.Url,
            apiResponse.MediaType == "image" ? MediaType.Image : MediaType.Video,
            DateTime.Parse(apiResponse.Date),
            apiResponse.Copyright,
            apiResponse.HdUrl,
            apiResponse.ThumbnailUrl
        );
    }
}
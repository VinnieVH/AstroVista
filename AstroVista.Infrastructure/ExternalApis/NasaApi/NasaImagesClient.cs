using System.Net.Http.Json;
using System.Web;
using AstroVista.Core.Interfaces.ExternalApis;
using AstroVista.Core.Models;
using AstroVista.Infrastructure.ExternalApis.NasaApi.Models;

namespace AstroVista.Infrastructure.ExternalApis.NasaApi;

public class NasaImagesClient : INasaImagesClient
{
    private readonly HttpClient _httpClient;
    
    public NasaImagesClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _httpClient.BaseAddress = new Uri("https://images-api.nasa.gov/");
    }
    
    public async Task<NasaImageSearchResult?> SearchImagesAsync(CancellationToken cancellationToken, string query,
        string? mediaType = null, int? page = 1, int? pageSize = 100)
    {
        try
        {
            var queryParams = new Dictionary<string, string?>
            {
                ["q"] = query,
                ["page"] = page.ToString(),
                ["page_size"] = pageSize.ToString()
            };

            if (!string.IsNullOrEmpty(mediaType))
            {
                queryParams["media_type"] = mediaType;
            }

            var requestUri = BuildQueryString("search", queryParams);
            var response = await _httpClient.GetFromJsonAsync<NasaImageSearchResponse>(requestUri, cancellationToken: cancellationToken);

            if (response == null)
                return null;

            return new NasaImageSearchResult(
                response.Collection.Href,
                response.Collection.Items.Select(i => new NasaItem(
                    i.Data.Select(d => new NasaItemData(
                        d.Center,
                        d.DateCreated,
                        d.Description,
                        d.Keywords?.AsReadOnly(),
                        d.MediaType,
                        d.NasaId,
                        d.Title
                    )).ToList(),
                    i.Href,
                    i.Links?.Select(l => new NasaLink(
                        l.Href,
                        l.Rel,
                        l.Prompt,
                        l.Render
                    )).ToList()
                )).ToList(),
                response.Collection.Links?.Select(l => new NasaLink(
                    l.Href,
                    l.Rel,
                    l.Prompt,
                    l.Render
                )).ToList(),
                response.Collection.Metadata.TotalHits,
                response.Collection.Version
            );
        }
        catch (Exception)
        {
            return null;
        }
    }

    public Task<NasaAssetManifest?> GetAssetManifestAsync(string nasaId, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public Task<NasaMetadataLocation?> GetMetadataLocationAsync(string nasaId, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public Task<NasaCaptionsLocation?> GetCaptionsLocationAsync(string nasaId, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public Task<NasaAlbumContents?> GetAlbumContentsAsync(CancellationToken cancellationToken, string albumName, int page = 1)
    {
        throw new NotImplementedException();
    }

    public async Task<NasaLatestImagesCollection?> GetLatestImagesAsync(CancellationToken cancellationToken, int page = 1, int pageSize = 100)
    {
        try
        {
            var queryParams = new Dictionary<string, string>
            {
                ["orderby"] = "recent",
                ["page"] = page.ToString(),
                ["page_size"] = pageSize.ToString()
            };

            var requestUri = BuildQueryString("asset/", queryParams);
            var response = await _httpClient.GetFromJsonAsync<NasaLatestImagesResponse>(requestUri, cancellationToken: cancellationToken);

            if (response == null)
                return null;
            
            return new NasaLatestImagesCollection(
                response.Collection.Version,
                response.Collection.Href,
                response.Collection.Items.Select(x => new NasaItem(
                    x.Data.Select(d => new NasaItemData(
                        d.Center,
                        d.DateCreated,
                        d.Description,
                        d.Keywords?.AsReadOnly(),
                        d.MediaType,
                        d.NasaId,
                        d.Title
                    )).ToList(), x.Href, x.Links.Select(y => new NasaLink(
                        y.Href, y.Rel, y.Prompt, y.Render)).ToList())
                ).ToList());
        }
        catch (Exception ex)
        {
            return null;
        }

    }

    private string BuildQueryString(string endpoint, Dictionary<string, string> parameters)
    {
        var queryString = HttpUtility.ParseQueryString(string.Empty);
            
        foreach (var param in parameters)
        {
            queryString[param.Key] = param.Value;
        }
            
        return $"{endpoint}?{queryString}";
    }
}
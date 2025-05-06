using System.Text.Json.Serialization;

namespace AstroVista.Infrastructure.ExternalApis.NasaApi.Models;

public class NasaItemResponse
{
    [JsonPropertyName("data")]
    public List<NasaItemDataResponse> Data { get; set; } = new();

    [JsonPropertyName("href")]
    public string Href { get; set; } = null!;

    [JsonPropertyName("links")]
    public List<NasaLinkResponse>? Links { get; set; }
}
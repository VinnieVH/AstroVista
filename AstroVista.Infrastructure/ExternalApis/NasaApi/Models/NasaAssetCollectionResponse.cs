using System.Text.Json.Serialization;

namespace AstroVista.Infrastructure.ExternalApis.NasaApi.Models;

public class NasaAssetCollectionResponse
{
    [JsonPropertyName("href")]
    public string Href { get; set; } = null!;

    [JsonPropertyName("items")]
    public List<NasaAssetItemResponse> Items { get; set; } = new();

    [JsonPropertyName("version")]
    public string Version { get; set; } = null!;
}
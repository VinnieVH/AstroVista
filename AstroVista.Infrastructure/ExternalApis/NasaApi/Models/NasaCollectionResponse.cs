using System.Text.Json.Serialization;

namespace AstroVista.Infrastructure.ExternalApis.NasaApi.Models;

public class NasaCollectionResponse
{
    [JsonPropertyName("href")]
    public string Href { get; set; } = null!;

    [JsonPropertyName("items")]
    public List<NasaItemResponse> Items { get; set; } = new();

    [JsonPropertyName("links")]
    public List<NasaLinkResponse>? Links { get; set; }

    [JsonPropertyName("metadata")]
    public NasaMetadataResponse Metadata { get; set; } = null!;

    [JsonPropertyName("version")]
    public string Version { get; set; } = null!;
}
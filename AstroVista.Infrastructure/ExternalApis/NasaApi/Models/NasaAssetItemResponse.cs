using System.Text.Json.Serialization;

namespace AstroVista.Infrastructure.ExternalApis.NasaApi.Models;

public class NasaAssetItemResponse
{
    [JsonPropertyName("href")]
    public string Href { get; set; } = null!;
}
using System.Text.Json.Serialization;

namespace AstroVista.Infrastructure.ExternalApis.NasaApi.Models;

public class NasaLinkResponse
{
    [JsonPropertyName("href")]
    public string Href { get; set; } = null!;

    [JsonPropertyName("rel")]
    public string? Rel { get; set; }

    [JsonPropertyName("prompt")]
    public string? Prompt { get; set; }

    [JsonPropertyName("render")]
    public string? Render { get; set; }
}
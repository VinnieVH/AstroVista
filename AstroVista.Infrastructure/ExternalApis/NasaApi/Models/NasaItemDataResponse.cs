using System.Text.Json.Serialization;

namespace AstroVista.Infrastructure.ExternalApis.NasaApi.Models;

public class NasaItemDataResponse
{
    [JsonPropertyName("center")]
    public string? Center { get; set; }

    [JsonPropertyName("date_created")]
    public DateTime DateCreated { get; set; }

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("keywords")]
    public List<string>? Keywords { get; set; }

    [JsonPropertyName("media_type")]
    public string MediaType { get; set; } = null!;

    [JsonPropertyName("nasa_id")]
    public string NasaId { get; set; } = null!;

    [JsonPropertyName("title")]
    public string Title { get; set; } = null!;
}
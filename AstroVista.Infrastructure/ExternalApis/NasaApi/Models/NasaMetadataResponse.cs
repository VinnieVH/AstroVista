using System.Text.Json.Serialization;

namespace AstroVista.Infrastructure.ExternalApis.NasaApi.Models;

public class NasaMetadataResponse
{
    [JsonPropertyName("total_hits")]
    public int TotalHits { get; set; }
}
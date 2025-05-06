using System.Text.Json.Serialization;

namespace AstroVista.Infrastructure.ExternalApis.NasaApi.Models;

public class NasaImageSearchResponse
{
    [JsonPropertyName("collection")]
    public NasaCollectionResponse Collection { get; set; } = null!;
}
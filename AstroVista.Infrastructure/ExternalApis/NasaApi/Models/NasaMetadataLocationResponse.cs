using System.Text.Json.Serialization;

namespace AstroVista.Infrastructure.ExternalApis.NasaApi.Models;

public class NasaMetadataLocationResponse
{
    
    [JsonPropertyName("location")]
    public string Location { get; set; } = null!;
}
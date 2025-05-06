using System.Text.Json.Serialization;

namespace AstroVista.Infrastructure.ExternalApis.NasaApi.Models;

public class NasaCaptionsLocationsResponse
{
    [JsonPropertyName("location")]
    public string Location { get; set; } = null!;
}
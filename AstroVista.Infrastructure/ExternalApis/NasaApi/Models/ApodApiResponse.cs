using System.Text.Json.Serialization;

namespace AstroVista.Infrastructure.ExternalApis.NasaApi.Models;

internal class ApodApiResponse
{
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;
    
    [JsonPropertyName("explanation")]
    public string Explanation { get; set; } = string.Empty;
    
    [JsonPropertyName("url")]
    public string Url { get; set; } = string.Empty;
    
    [JsonPropertyName("media_type")]
    public string MediaType { get; set; } = string.Empty;
    
    [JsonPropertyName("date")]
    public string Date { get; set; } = string.Empty;
    
    [JsonPropertyName("copyright")]
    public string? Copyright { get; set; }
    
    [JsonPropertyName("hdurl")]
    public string? HdUrl { get; set; }
    
    [JsonPropertyName("thumbnail_url")]
    public string? ThumbnailUrl { get; set; }
    
    [JsonPropertyName("service_version")]
    public string? ServiceVersion { get; set; }
}
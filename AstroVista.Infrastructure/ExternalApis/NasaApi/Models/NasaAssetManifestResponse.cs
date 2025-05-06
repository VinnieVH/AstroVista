using System.Text.Json.Serialization;

namespace AstroVista.Infrastructure.ExternalApis.NasaApi.Models;

public class NasaAssetManifestResponse
{
    [JsonPropertyName("collection")]
    public NasaAssetCollectionResponse Collection { get; set; } = null!;
}
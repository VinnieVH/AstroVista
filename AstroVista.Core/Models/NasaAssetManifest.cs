namespace AstroVista.Core.Models;

public record NasaAssetManifest(
    string Href,
    IReadOnlyList<NasaAsset> Assets,
    string Version);
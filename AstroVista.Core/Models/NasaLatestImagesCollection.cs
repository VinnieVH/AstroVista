namespace AstroVista.Core.Models;

public record NasaLatestImagesCollection(
    string Version,
    string Href,
    IReadOnlyList<NasaItem> Items);
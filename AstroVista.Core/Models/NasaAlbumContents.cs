namespace AstroVista.Core.Models;

public record NasaAlbumContents(
    string Href,
    IReadOnlyList<NasaItem> Items,
    IReadOnlyList<NasaLink>? Links,
    int TotalHits,
    string Version);
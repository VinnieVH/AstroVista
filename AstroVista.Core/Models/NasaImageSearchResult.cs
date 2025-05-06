namespace AstroVista.Core.Models;

public record NasaImageSearchResult(
    string Href,
    IReadOnlyList<NasaItem> Items,
    IReadOnlyList<NasaLink>? Links,
    int TotalHits,
    string Version);
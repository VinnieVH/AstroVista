namespace AstroVista.Core.Models;

public record NasaItem(
    IReadOnlyList<NasaItemData> Data,
    string Href,
    IReadOnlyList<NasaLink>? Links);
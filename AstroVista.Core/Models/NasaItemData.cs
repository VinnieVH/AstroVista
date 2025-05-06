namespace AstroVista.Core.Models;

public record NasaItemData(
    string? Center,
    DateTime DateCreated,
    string? Description,
    IReadOnlyList<string>? Keywords,
    string MediaType,
    string NasaId,
    string Title);
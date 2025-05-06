namespace AstroVista.Core.Models;

public record NasaLink(
    string Href,
    string? Rel,
    string? Prompt,
    string? Render);
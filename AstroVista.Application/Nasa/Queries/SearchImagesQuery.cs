namespace AstroVista.Application.Nasa.Queries;

public record SearchImagesQuery(string Query, string? MediaType, int? Page, int? PageSize);
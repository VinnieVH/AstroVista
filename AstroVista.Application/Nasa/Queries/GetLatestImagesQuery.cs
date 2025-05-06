namespace AstroVista.Application.Nasa.Queries;

public record GetLatestImagesQuery(int Page = 1, int PageSize = 20);
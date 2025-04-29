namespace AstroVista.Application.Nasa.Queries;

public record GetApodQuery(
    DateTime? Date = null,
    bool? ThumbsEnabled = null
);
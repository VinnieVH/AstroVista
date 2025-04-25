namespace AstroVista.Core.Messages.Queries.Nasa;

public record GetApodQuery(
    DateTime? Date = null,
    bool? ThumbsEnabled = null
);
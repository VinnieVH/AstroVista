namespace AstroVista.Application.Posts.Responses;

public record UpdatePostResponse(
    Guid Id,
    string Title,
    string Content,
    DateTime DateUpdated);
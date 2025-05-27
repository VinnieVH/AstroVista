namespace AstroVista.Application.Posts.Responses;

public record GetPostResponse(
    Guid Id,
    string Title,
    string Content,
    Guid UserId,
    string UserName,
    DateTime DateCreated,
    DateTime DateUpdated);
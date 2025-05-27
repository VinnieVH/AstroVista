namespace AstroVista.Application.Posts.Responses;

public record CreatePostResponse(
    Guid Id,
    string Title,
    string Content,
    Guid UserId,
    DateTime DateCreated);
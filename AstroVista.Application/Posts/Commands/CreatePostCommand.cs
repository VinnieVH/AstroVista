namespace AstroVista.Application.Posts.Commands;

public record CreatePostCommand(
    string Title,
    string Content,
    Guid UserId);
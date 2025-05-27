namespace AstroVista.Application.Posts.Commands;

public record UpdatePostCommand(
    Guid PostId,
    string Title,
    string Content
);
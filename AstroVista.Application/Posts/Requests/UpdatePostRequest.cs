namespace AstroVista.Application.Posts.Requests;

public record UpdatePostRequest(
    string Title,
    string Content
);
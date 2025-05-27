using AstroVista.Application.Posts.Requests;

namespace AstroVista.Application.Posts.Commands;

public record BulkUpdatePostsCommand(Guid UserId, IEnumerable<UpdatePostRequest> Posts);
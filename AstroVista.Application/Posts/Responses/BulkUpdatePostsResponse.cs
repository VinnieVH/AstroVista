namespace AstroVista.Application.Posts.Responses;

public record BulkUpdatePostsResponse(IEnumerable<Guid> PostIds);
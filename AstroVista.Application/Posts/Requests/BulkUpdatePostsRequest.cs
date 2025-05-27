namespace AstroVista.Application.Posts.Requests;

public record BulkUpdatePostsRequest(IEnumerable<UpdatePostRequest> Posts);
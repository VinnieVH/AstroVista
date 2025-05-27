using AstroVista.Application.Posts.Queries;
using AstroVista.Application.Posts.Responses;
using AstroVista.Core.Interfaces.Repositories;
using FluentValidation;

namespace AstroVista.Application.Posts.Handlers;

public class GetPostHandler
{
    public static async Task<GetPostResponse> HandleAsync(
        GetPostQuery query,
        IPostRepository postRepository,
        IValidator<GetPostQuery> validator,
        CancellationToken cancellation)
    {
        var validationResult = await validator.ValidateAsync(query, cancellation);
        if (!validationResult.IsValid) throw new ValidationException(validationResult.Errors);

        var post = await postRepository.GetPostWithUserAsync(query.PostId, cancellation);

        if (post == null) throw new ArgumentException($"Post with ID {query.PostId} not found.");

        return new GetPostResponse(
            post.Id,
            post.Title,
            post.Content,
            post.UserId,
            post.User?.Username ?? "Unknown",
            post.DateCreated,
            post.DateUpdated
        );
    }
}
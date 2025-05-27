using AstroVista.Application.Posts.Queries;
using AstroVista.Application.Posts.Responses;
using AstroVista.Core.Interfaces.Repositories;
using FluentValidation;

namespace AstroVista.Application.Posts.Handlers;

public class GetPostsByUserHandler
{
    public static async Task<IEnumerable<GetPostResponse>> HandleAsync(
        GetPostsByUserQuery query,
        IPostRepository postRepository,
        IValidator<GetPostsByUserQuery> validator,
        CancellationToken cancellation)
    {
        var validationResult = await validator.ValidateAsync(query, cancellation);
        if (!validationResult.IsValid) throw new ValidationException(validationResult.Errors);

        var posts = await postRepository.GetPostsByUserIdAsync(query.UserId, cancellation);

        return posts.Select(post => new GetPostResponse(
            post.Id,
            post.Title,
            post.Content,
            post.UserId,
            post.User?.Username ?? "Unknown",
            post.DateCreated,
            post.DateUpdated
        ));
    }
}
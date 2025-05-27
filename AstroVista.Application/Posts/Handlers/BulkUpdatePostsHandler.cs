using AstroVista.Application.Posts.Commands;
using AstroVista.Core.Entities;
using AstroVista.Core.Interfaces.Repositories;
using FluentValidation;

namespace AstroVista.Application.Posts.Handlers;

public class BulkUpdatePostsHandler
{
    public static async Task<IEnumerable<Guid>> HandleAsync(
        BulkUpdatePostsCommand command,
        IPostRepository postRepository,
        IValidator<BulkUpdatePostsCommand> validator,
        CancellationToken cancellation)
    {
        var validationResult = await validator.ValidateAsync(command, cancellation);
        if (!validationResult.IsValid)
            throw new ValidationException(validationResult.Errors);

        var posts = command.Posts
            .Select(x =>
                new Post
                {
                    Title = x.Title,
                    Content = x.Content,
                    DateUpdated = DateTime.UtcNow
                }).ToList();

        var updatedIds = await postRepository.BulkUpdatePostsAsync(
            command.UserId,
            posts,
            cancellation);

        return updatedIds;
    }
}
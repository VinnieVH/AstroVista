using AstroVista.Application.Posts.Commands;
using AstroVista.Application.Posts.Responses;
using AstroVista.Core.Interfaces.Repositories;
using FluentValidation;

namespace AstroVista.Application.Posts.Handlers;

public class UpdatePostHandler
{
    public static async Task<UpdatePostResponse> HandleAsync(
        UpdatePostCommand command,
        IPostRepository postRepository,
        IValidator<UpdatePostCommand> validator,
        CancellationToken cancellation)
    {
        var validationResult = await validator.ValidateAsync(command, cancellation);
        if (!validationResult.IsValid) throw new ValidationException(validationResult.Errors);

        var post = await postRepository.GetByIdAsync(command.PostId, cancellation);
        if (post == null) throw new ArgumentException($"Post with ID {command.PostId} not found.");

        post.Title = command.Title;
        post.Content = command.Content;
        post.DateUpdated = DateTime.UtcNow;

        postRepository.Update(post);
        await postRepository.SaveChangesAsync(cancellation);

        return new UpdatePostResponse(
            post.Id,
            post.Title,
            post.Content,
            post.DateUpdated
        );
    }
}
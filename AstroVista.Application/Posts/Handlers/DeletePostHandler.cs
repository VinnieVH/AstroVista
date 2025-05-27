using AstroVista.Application.Posts.Commands;
using AstroVista.Core.Interfaces.Repositories;
using FluentValidation;

namespace AstroVista.Application.Posts.Handlers;

public class DeletePostHandler
{
    public static async Task HandleAsync(
        DeletePostCommand command,
        IPostRepository postRepository,
        IValidator<DeletePostCommand> validator,
        CancellationToken cancellation)
    {
        var validationResult = await validator.ValidateAsync(command, cancellation);
        if (!validationResult.IsValid) throw new ValidationException(validationResult.Errors);

        var post = await postRepository.GetByIdAsync(command.PostId, cancellation);
        if (post == null) throw new ArgumentException($"Post with ID {command.PostId} not found.");

        postRepository.Delete(post);
        await postRepository.SaveChangesAsync(cancellation);
    }
}
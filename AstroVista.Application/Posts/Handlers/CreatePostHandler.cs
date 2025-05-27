using AstroVista.Application.Posts.Commands;
using AstroVista.Application.Posts.Responses;
using AstroVista.Core.Entities;
using AstroVista.Core.Interfaces.Repositories;
using FluentValidation;

namespace AstroVista.Application.Posts.Handlers;

public class CreatePostHandler
{
    public static async Task<CreatePostResponse> HandleAsync(
        CreatePostCommand command,
        IPostRepository postRepository,
        IUserRepository userRepository,
        IValidator<CreatePostCommand> validator,
        CancellationToken cancellation)
    {
        var validationResult = await validator.ValidateAsync(command, cancellation);
        if (!validationResult.IsValid) throw new ValidationException(validationResult.Errors);

        if (!await userRepository.UserExistsAsync(command.UserId, cancellation))
            throw new ArgumentException($"User with ID {command.UserId} not found.");

        var post = new Post
        {
            Id = Guid.NewGuid(),
            Title = command.Title,
            Content = command.Content,
            UserId = command.UserId,
            DateCreated = DateTime.UtcNow,
            DateUpdated = DateTime.UtcNow
        };

        await postRepository.AddAsync(post, cancellation);
        await postRepository.SaveChangesAsync(cancellation);

        return new CreatePostResponse(
            post.Id,
            post.Title,
            post.Content,
            post.UserId,
            post.DateCreated
        );
    }
}
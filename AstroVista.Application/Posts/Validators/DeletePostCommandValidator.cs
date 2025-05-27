using AstroVista.Application.Posts.Commands;
using FluentValidation;

namespace AstroVista.Application.Posts.Validators;

public class DeletePostCommandValidator : AbstractValidator<DeletePostCommand>
{
    public DeletePostCommandValidator()
    {
        RuleFor(x => x.PostId)
            .NotEmpty().WithMessage("Post ID is required.")
            .NotEqual(Guid.Empty).WithMessage("Post ID must be a valid GUID.");
    }
}
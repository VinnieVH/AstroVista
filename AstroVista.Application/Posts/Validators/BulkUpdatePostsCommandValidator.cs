using AstroVista.Application.Posts.Commands;
using FluentValidation;

namespace AstroVista.Application.Posts.Validators;

public class BulkUpdatePostsCommandValidator : AbstractValidator<BulkUpdatePostsCommand>
{
    public BulkUpdatePostsCommandValidator()
    {
        RuleFor(x => x.Posts)
            .NotEmpty().WithMessage("Posts are required.");
    }
}
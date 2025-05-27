using AstroVista.Application.Posts.Queries;
using FluentValidation;

namespace AstroVista.Application.Posts.Validators;

public class GetPostQueryValidator : AbstractValidator<GetPostQuery>
{
    public GetPostQueryValidator()
    {
        RuleFor(x => x.PostId)
            .NotEmpty().WithMessage("Post ID is required.")
            .NotEqual(Guid.Empty).WithMessage("Post ID must be a valid GUID.");
    }
}
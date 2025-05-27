using AstroVista.Application.Posts.Queries;
using FluentValidation;

namespace AstroVista.Application.Posts.Validators;

public class GetPostsByUserQueryValidator : AbstractValidator<GetPostsByUserQuery>
{
    public GetPostsByUserQueryValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required.")
            .NotEqual(Guid.Empty).WithMessage("User ID must be a valid GUID.");
    }
}
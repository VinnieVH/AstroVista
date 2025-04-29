using AstroVista.Application.Users.Commands;
using AstroVista.Core.Interfaces.Repositories;
using FluentValidation;

namespace AstroVista.Application.Users.Validators;

public class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
{
    private readonly IUserRepository _userRepository;
    public CreateUserCommandValidator(IUserRepository userRepository)
    {
        _userRepository = userRepository;
        
        RuleFor(x => x.Username)
            .MustAsync(async(username, cancellation) => 
                !await _userRepository.UsernameExistsAsync(username, cancellation)).WithMessage("Username is already in use")
            .NotEmpty().WithMessage("Username is required")
            .MinimumLength(3).WithMessage("Username must be at least 3 characters")
            .MaximumLength(50).WithMessage("Username cannot exceed 50 characters");
            
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required")
            .MaximumLength(100).WithMessage("First name cannot exceed 100 characters");
            
        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Last name is required")
            .MaximumLength(100).WithMessage("Last name cannot exceed 100 characters");
            
        RuleFor(x => x.Email)
            .MustAsync(async(email, cancellation) => 
                !await _userRepository.EmailExistsAsync(email, cancellation)).WithMessage("Email is already in use")
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("A valid email address is required")
            .MaximumLength(100).WithMessage("Email cannot exceed 100 characters");
    }
}
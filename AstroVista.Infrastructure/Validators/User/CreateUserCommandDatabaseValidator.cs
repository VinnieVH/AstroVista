using AstroVista.Core.Messages.Commands.User;
using AstroVista.Infrastructure.Data.Context;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace AstroVista.Infrastructure.Validators.User;

public class CreateUserCommandDatabaseValidator : AbstractValidator<CreateUserCommand>
{
    private readonly AstroVistaDbContext _dbContext;
    
    public CreateUserCommandDatabaseValidator(AstroVistaDbContext dbContext)
    {
        _dbContext = dbContext;
        
        RuleFor(x => x.Email)
            .MustAsync(BeUniqueEmail).WithMessage("The specified email is already in use");
        RuleFor(x => x.Username)
            .MustAsync(BeUniqueUsername).WithMessage("The specified username is already in use");
    }
    
    private async Task<bool> BeUniqueEmail(string email, CancellationToken cancellationToken)
    {
        return !await _dbContext.Users.AnyAsync(u => u.Email == email, cancellationToken);
    }
    
    private async Task<bool> BeUniqueUsername(string username, CancellationToken cancellationToken)
    {
        return !await _dbContext.Users.AnyAsync(u => u.Username == username, cancellationToken);
    }
}
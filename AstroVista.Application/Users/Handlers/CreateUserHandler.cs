using AstroVista.Application.Users.Commands;
using AstroVista.Application.Users.Responses;
using AstroVista.Core.Entities;
using AstroVista.Core.Interfaces.Repositories;

namespace AstroVista.Application.Users.Handlers;

public class CreateUserHandler
{
    public static async Task<CreateUserResponse> HandleAsync(
        CreateUserCommand command,
        IUserRepository userRepository,
        CancellationToken cancellation)
    {
        var user = new User
        {
            Username = command.Username,
            FirstName = command.FirstName,
            LastName = command.LastName,
            Email = command.Email,
            DateCreated = DateTime.UtcNow,
            DateUpdated = DateTime.UtcNow
        };
        
        await userRepository.AddAsync(user, cancellation);
        await userRepository.SaveChangesAsync(cancellation);
        
        return new CreateUserResponse(user.Id);
    }
}
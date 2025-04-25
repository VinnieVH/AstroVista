using AstroVista.Core.Entities;
using AstroVista.Core.Messages.Commands.User;
using AstroVista.Core.Messages.Responses.User;
using AstroVista.Infrastructure.Data.Context;

namespace AstroVista.Infrastructure.Handlers.Commands;

public class CreateUserHandler
{
    public static async Task<CreateUserResponse> HandleAsync(
        CreateUserCommand command, 
        AstroVistaDbContext dbContext,
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
        
        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync(cancellation);
        
        return new CreateUserResponse(user.Id);
    }
}
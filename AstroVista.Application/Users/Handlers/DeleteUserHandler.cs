using AstroVista.Application.Users.Commands;
using AstroVista.Core.Interfaces.Repositories;

namespace AstroVista.Application.Users.Handlers;

public class DeleteUserHandler
{
    public static async Task HandleAsync(
        DeleteUserCommand command,
        IUserRepository userRepository,
        CancellationToken cancellation)
    {
        
        var user = await userRepository.GetByIdAsync(command.Id, cancellation);
        if (user != null)
        {
            userRepository.Delete(user);
            await userRepository.SaveChangesAsync(cancellation);
        }
    }
}
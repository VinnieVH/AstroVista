using AstroVista.Application.Users.Queries;
using AstroVista.Core.Entities;
using AstroVista.Core.Interfaces.Repositories;
using AstroVista.Core.Messages.Responses.User;

namespace AstroVista.Infrastructure.Handlers.Queries.Users;

public class GetUserByIdQueryHandler
{
    public static async Task<GetUserResponse?> HandleAsync(
        GetUserByIdQuery query,
        IUserRepository userRepository,
        CancellationToken cancellation)
    {
        var user = await userRepository.GetByIdAsync(query.Id, cancellation);

        return user == null ? null : new GetUserResponse(user.Username, user.FirstName, user.LastName, user.Email);
    }
}
using AstroVista.Application.Users.Queries;
using AstroVista.Application.Users.Responses;
using AstroVista.Core.Interfaces.Repositories;

namespace AstroVista.Application.Users.Handlers;

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
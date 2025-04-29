using AstroVista.Core.Entities;

namespace AstroVista.Core.Interfaces.Repositories;

public interface IUserRepository : IRepository<User>
{
    Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken);
    Task<bool> UsernameExistsAsync(string username, CancellationToken cancellationToken);
};
using AstroVista.Core.Entities;
using AstroVista.Core.Interfaces.Repositories;
using AstroVista.Infrastructure.Data.Context;
using Microsoft.EntityFrameworkCore;

namespace AstroVista.Infrastructure.Data.Repositories;

public class UserRepository(AstroVistaDbContext dbContext) : Repository<User>(dbContext), IUserRepository
{
    private readonly AstroVistaDbContext _dbContext = dbContext;

    public async Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken)
    {
        return await _dbContext.Users.AnyAsync(u => u.Email == email, cancellationToken);
    }

    public async Task<bool> UsernameExistsAsync(string username, CancellationToken cancellationToken)
    {
        return await _dbContext.Users.AnyAsync(u => u.Username == username, cancellationToken);
    }

    public async Task<bool> UserExistsAsync(Guid userId, CancellationToken cancellationToken)
    {
        return await _dbContext.Users
            .AnyAsync(u => u.Id == userId, cancellationToken);
    }

    public async Task<User?> GetUserWithPostsAsync(Guid userId, CancellationToken cancellationToken)
    {
        return await _dbContext.Users
            .Include(u => u.Posts.OrderByDescending(p => p.DateCreated))
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
    }
}
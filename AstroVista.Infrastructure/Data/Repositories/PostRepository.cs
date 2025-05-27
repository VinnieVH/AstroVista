using AstroVista.Core.Entities;
using AstroVista.Core.Interfaces.Repositories;
using AstroVista.Infrastructure.Data.Context;
using Microsoft.EntityFrameworkCore;

namespace AstroVista.Infrastructure.Data.Repositories;

public class PostRepository(AstroVistaDbContext dbContext) : Repository<Post>(dbContext), IPostRepository
{
    private readonly AstroVistaDbContext _dbContext = dbContext;


    public async Task<IEnumerable<Post>> GetPostsByUserIdAsync(Guid userId, CancellationToken cancellationToken)
    {
        return await _dbContext.Posts
            .Include(p => p.User)
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.DateCreated)
            .ToListAsync(cancellationToken);
    }

    public async Task<Post?> GetPostWithUserAsync(Guid postId, CancellationToken cancellationToken)
    {
        return await _dbContext.Posts
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.Id == postId, cancellationToken);
    }

    public async Task<bool> PostExistsAsync(Guid postId, CancellationToken cancellationToken)
    {
        return await _dbContext.Posts.AnyAsync(p => p.Id == postId, cancellationToken);
    }

    public async Task<bool> UserOwnsPostAsync(Guid userId, Guid postId, CancellationToken cancellationToken)
    {
        return await _dbContext.Posts.AnyAsync(p => p.Id == postId && p.UserId == userId, cancellationToken);
    }
}
using AstroVista.Core.Entities;

namespace AstroVista.Core.Interfaces.Repositories;

public interface IPostRepository : IRepository<Post>
{
    Task<IEnumerable<Post>> GetPostsByUserIdAsync(Guid userId, CancellationToken cancellationToken);
    Task<Post?> GetPostWithUserAsync(Guid postId, CancellationToken cancellationToken);
    Task<bool> PostExistsAsync(Guid postId, CancellationToken cancellationToken);
    Task<bool> UserOwnsPostAsync(Guid userId, Guid postId, CancellationToken cancellationToken);
}
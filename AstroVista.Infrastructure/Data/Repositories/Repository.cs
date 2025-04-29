using AstroVista.Core.Interfaces.Repositories;
using AstroVista.Infrastructure.Data.Context;
using Microsoft.EntityFrameworkCore;

namespace AstroVista.Infrastructure.Data.Repositories;

public class Repository<T>(AstroVistaDbContext dbContext) : IRepository<T>
    where T : class
{
    public async Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await dbContext.Set<T>().FindAsync([id], cancellationToken);
    }
        
    public async Task<List<T>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await dbContext.Set<T>().ToListAsync(cancellationToken);
    }
        
    public async Task AddAsync(T entity, CancellationToken cancellationToken)
    {
        await dbContext.Set<T>().AddAsync(entity, cancellationToken);
    }
        
    public void Update(T entity)
    {
        dbContext.Set<T>().Update(entity);
    }
        
    public void Delete(T entity)
    {
        dbContext.Set<T>().Remove(entity);
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken)
    {
        return await dbContext.SaveChangesAsync(cancellationToken);   
    }
}
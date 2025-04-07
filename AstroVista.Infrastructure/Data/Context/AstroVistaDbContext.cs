using Microsoft.EntityFrameworkCore;

namespace AstroVista.Infrastructure.Data.Context;

public class AstroVistaDbContext(DbContextOptions<AstroVistaDbContext> options) : DbContext(options);
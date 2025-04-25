using AstroVista.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace AstroVista.Infrastructure.Data.Context
{
    public class AstroVistaDbContext(DbContextOptions<AstroVistaDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
            
            SeedData(modelBuilder);
        }

        private static void SeedData(ModelBuilder modelBuilder)
        {
            var fixedDate = new DateTime(2023, 1, 1, 0,0,0, DateTimeKind.Utc);

            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = Guid.Parse("12345678-1234-1234-1234-123456789abc"),
                    Username = "SkreamO", 
                    FirstName = "Vincent", 
                    LastName = "Van Herreweghe", 
                    Email = "admin@astrovista.com", 
                    DateCreated = fixedDate, 
                    DateUpdated = fixedDate
                }
            );
        }
    }
}
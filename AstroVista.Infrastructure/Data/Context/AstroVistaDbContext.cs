using AstroVista.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace AstroVista.Infrastructure.Data.Context;

public class AstroVistaDbContext(DbContextOptions<AstroVistaDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<Post> Posts { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        // Post configuration - establish relationship
        modelBuilder.Entity<Post>()
            .HasOne(p => p.User)
            .WithMany(u => u.Posts)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        var fixedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        var userId = Guid.Parse("12345678-1234-1234-1234-123456789abc");

        // Seed User
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = userId,
                Username = "SkreamO",
                FirstName = "Vincent",
                LastName = "Van Herreweghe",
                Email = "admin@astrovista.com",
                DateCreated = fixedDate,
                DateUpdated = fixedDate
            }
        );

        // Seed Posts
        modelBuilder.Entity<Post>().HasData(
            new Post
            {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Title = "Welcome to AstroVista",
                Content = "This is my first post on AstroVista! Excited to share my astronomical observations.",
                UserId = userId,
                DateCreated = fixedDate,
                DateUpdated = fixedDate
            },
            new Post
            {
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                Title = "Amazing Saturn Observation",
                Content = "Last night I observed Saturn through my telescope. The rings were incredibly clear!",
                UserId = userId,
                DateCreated = fixedDate.AddDays(1),
                DateUpdated = fixedDate.AddDays(1)
            },
            new Post
            {
                Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                Title = "Meteor Shower Report",
                Content = "The Perseid meteor shower was spectacular this year. Counted over 50 meteors per hour!",
                UserId = userId,
                DateCreated = fixedDate.AddDays(7),
                DateUpdated = fixedDate.AddDays(7)
            }
        );
    }
}
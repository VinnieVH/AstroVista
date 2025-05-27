namespace AstroVista.Core.Entities;

public class User : BaseEntity
{
    public required string Username { get; init; }
    public required string FirstName { get; init; }
    public required string LastName { get; init; }
    public required string Email { get; init; }

    // Navigation property
    public virtual ICollection<Post> Posts { get; set; } = new List<Post>();
}
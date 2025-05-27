namespace AstroVista.Core.Entities;

public class Post : BaseEntity
{
    public required string Title { get; set; }
    public required string Content { get; set; }
    public Guid UserId { get; set; }

    // Navigation property
    public virtual User User { get; set; }
}
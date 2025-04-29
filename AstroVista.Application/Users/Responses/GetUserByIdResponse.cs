namespace AstroVista.Core.Messages.Responses.User;

public record GetUserResponse(string Username, string FirstName, string LastName, string Email);
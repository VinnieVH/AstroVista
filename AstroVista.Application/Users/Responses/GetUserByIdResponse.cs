namespace AstroVista.Application.Users.Responses;

public record GetUserResponse(string Username, string FirstName, string LastName, string Email);
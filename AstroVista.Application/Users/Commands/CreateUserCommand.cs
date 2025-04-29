namespace AstroVista.Application.Users.Commands;

public record CreateUserCommand(
    string Username,
    string FirstName,
    string LastName,
    string Email);
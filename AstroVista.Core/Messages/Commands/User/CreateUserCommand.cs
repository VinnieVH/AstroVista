namespace AstroVista.Core.Messages.Commands.User;

public record CreateUserCommand(
    string Username,
    string FirstName,
    string LastName,
    string Email);
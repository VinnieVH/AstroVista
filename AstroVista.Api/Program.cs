using AstroVista.Core.Messages.Commands.User;
using AstroVista.Core.Messages.Responses.User;
using AstroVista.Core.Validators.User;
using AstroVista.Infrastructure.Data.Context;
using AstroVista.Infrastructure.Validators.User;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Wolverine;
using Wolverine.EntityFrameworkCore;
using Wolverine.FluentValidation;
using Wolverine.Postgresql;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("AstroVistaDb")!;

builder.Services.AddScoped<IValidator<CreateUserCommand>, CreateUserCommandValidator>();

builder.Host.UseWolverine(opts =>
{
    opts.PersistMessagesWithPostgresql(connectionString);
    opts.UseEntityFrameworkCoreTransactions();
    
    opts.UseFluentValidation();
    
    opts.Discovery.IncludeAssembly(typeof(Program).Assembly); // API project handlers if any
    opts.Discovery.IncludeAssembly(typeof(AstroVistaDbContext).Assembly);
    
    opts.Durability.Mode = DurabilityMode.MediatorOnly;
});

builder.Services.AddDbContext<AstroVistaDbContext>(opt
        => opt.UseNpgsql(connectionString), 
    optionsLifetime: ServiceLifetime.Singleton);

builder.AddGraphQL().AddTypes();

var app = builder.Build();

app.MapGraphQL();

app.MapPost("/users/create", async (CreateUserCommand cmd, IMessageBus bus) =>
{
    try
    {
        var response = await bus.InvokeAsync<CreateUserResponse>(cmd);
        return Results.Ok(response);
    }
    catch (FluentValidation.ValidationException ex)
    {
        var errors = ex.Errors
            .GroupBy(e => e.PropertyName)
            .ToDictionary(
                g => g.Key,
                g => g.Select(e => e.ErrorMessage).ToArray()
            );

        return Results.BadRequest(new { errors });
    }
    catch (Exception ex)
    {
        // Log the exception
        return Results.Problem(
            detail: ex.Message,
            title: "An error occurred while creating the user",
            statusCode: 500);
    }
});

app.RunWithGraphQLCommands(args);
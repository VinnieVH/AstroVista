using AstroVista.Core.Interfaces.ExternalApis;
using AstroVista.Core.Messages.Commands.User;
using AstroVista.Core.Messages.Queries.Nasa;
using AstroVista.Core.Messages.Responses.User;
using AstroVista.Core.Models;
using AstroVista.Core.Validators.User;
using AstroVista.Infrastructure.Data.Context;
using AstroVista.Infrastructure.ExternalApis.NasaApi;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Wolverine;
using Wolverine.EntityFrameworkCore;
using Wolverine.FluentValidation;
using Wolverine.Postgresql;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("AstroVistaDb")!;

builder.Services.AddScoped<IValidator<CreateUserCommand>, CreateUserCommandValidator>();

builder.Services.AddHttpClient<INasaApodClient, NasaApodClient>();

builder.Host.UseWolverine(opts =>
{
    opts.PersistMessagesWithPostgresql(connectionString);
    opts.UseEntityFrameworkCoreTransactions();
    
    opts.UseFluentValidation();
    
    opts.Discovery.IncludeAssembly(typeof(Program).Assembly);
    opts.Discovery.IncludeAssembly(typeof(AstroVistaDbContext).Assembly);
    
    opts.Durability.Mode = DurabilityMode.MediatorOnly;
});

builder.Services.AddDbContext<AstroVistaDbContext>(opt
        => opt.UseNpgsql(connectionString), 
    optionsLifetime: ServiceLifetime.Singleton);

var app = builder.Build();

// API Endpoint for NASA APOD
app.MapGet("/nasa/apod", async (
    [FromQuery] DateTime? date,
    [FromQuery] bool? thumbs,
    IMessageBus bus,
    CancellationToken cancellationToken) =>
{
    try
    {
        var query = new GetApodQuery(date, thumbs);
        var result = await bus.InvokeAsync<AstronomyPicture?>(query, cancellationToken);
        
        if (result == null)
            return Results.NotFound(new { message = "No astronomy picture found for the specified date" });
            
        return Results.Ok(result);
    }
    catch (Exception ex)
    {
        // Log the exception
        return Results.Problem(
            title: "Error retrieving Astronomy Picture of the Day",
            detail: ex.Message,
            statusCode: 500);
    }
});

app.MapPost("/users/create", async (CreateUserCommand cmd, IMessageBus bus) =>
{
    try
    {
        var response = await bus.InvokeAsync<CreateUserResponse>(cmd);
        return Results.Ok(response);
    }
    catch (ValidationException ex)
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

app.Run();
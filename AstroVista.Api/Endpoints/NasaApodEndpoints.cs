using AstroVista.API.Endpoints.Common;
using AstroVista.Application.Nasa.Queries;
using AstroVista.Core.Models;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace AstroVista.Api.Endpoints;

public static class NasaApodEndpoints
{
    public static IEndpointRouteBuilder MapNasaApodEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapApiGroup("/api/nasa/apod", "Nasa APOD");

        group.MapGet("/", GetApod)
            .WithName("GetApod")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
        return app;
    }

    private static async Task<IResult> GetApod(
        [FromQuery] DateTime? date,
        [FromQuery] bool? thumbs,
        IMessageBus bus,
        CancellationToken cancellationToken)
    {
        try
        {
            var query = new GetApodQuery(date, thumbs);
            var result = await bus.InvokeAsync<AstronomyPicture?>(query, cancellationToken);
        
            return result == null ? Results.NotFound(new { message = "No astronomy picture found for the specified date" }) : Results.Ok(result);
        }
        catch (Exception ex)
        {
            // Log the exception
            return Results.Problem(
                title: "Error retrieving Astronomy Picture of the Day",
                detail: ex.Message,
                statusCode: 500);
        }
    }
}
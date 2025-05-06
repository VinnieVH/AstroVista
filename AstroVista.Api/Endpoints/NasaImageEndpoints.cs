using AstroVista.API.Endpoints.Common;
using AstroVista.Application.Nasa.Queries;
using AstroVista.Application.Nasa.Responses;
using Wolverine;

namespace AstroVista.Api.Endpoints;

public static class NasaImageEndpoints
{
    public static IEndpointRouteBuilder MapNasaImageEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapApiGroup("/api/nasa/image", "Nasa Image");

        group.MapGet("/latest", GetLatestImages)
            .WithName("GetLatestImages")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/search", SearchImages)
            .WithName("SearchNasaImages")
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
        return app;
    }
    
    private static async Task<IResult> SearchImages(
        string? query, 
        string? mediaType, 
        int? page, 
        int? pageSize, 
        IMessageBus bus)
    {
        try
        {
            var command = new SearchImagesQuery(
                query,
                mediaType,
                page ?? 1,
                pageSize ?? 100);

            var result = await bus.InvokeAsync<SearchImagesResponse>(command);
            return result.SearchResult != null 
                ? Results.Ok(result.SearchResult) 
                : Results.NotFound();
        }
        catch (Exception ex)
        {
            // Log the exception
            return Results.Problem(
                title: "Error searching NASA images API",
                detail: ex.Message,
                statusCode: 500);
        }
    }
    
    private static async Task<IResult> GetLatestImages(
        IMessageBus bus)
    {
        try
        {
            var command = new GetLatestImagesQuery();

            var result = await bus.InvokeAsync<GetLatestImagesResponse>(command);
            return Results.Ok(result);
        }
        catch (Exception ex)
        {
            // Log the exception
            return Results.Problem(
                title: "Error searching NASA images API",
                detail: ex.Message,
                statusCode: 500);
        }
    }
}
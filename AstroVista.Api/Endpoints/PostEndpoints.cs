using AstroVista.API.Endpoints.Common;
using AstroVista.Application.Posts.Commands;
using AstroVista.Application.Posts.Queries;
using AstroVista.Application.Posts.Requests;
using AstroVista.Application.Posts.Responses;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace AstroVista.Api.Endpoints;

public static class PostEndpoints
{
    public static IEndpointRouteBuilder MapPostEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapApiGroup("/api/posts", "Posts");

        group.MapPost("/", CreatePost)
            .WithName("CreatePost")
            .Produces<CreatePostResponse>(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/{id:guid}", GetPost)
            .WithName("GetPost")
            .Produces<GetPostResponse>()
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapPatch("/{id:guid}", UpdatePost)
            .WithName("UpdatePost")
            .Produces<UpdatePostResponse>()
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapDelete("/{id:guid}", DeletePost)
            .WithName("DeletePost")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/user/{userId:guid}", GetPostsByUser)
            .WithName("GetPostsByUser")
            .Produces<IEnumerable<GetPostResponse>>()
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapPut("/user/{userId:guid}/bulk", BulkUpdatePosts)
            .WithName("BulkUpdatePosts")
            .Produces<BulkUpdatePostsResponse>()
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);


        return app;
    }

    private static async Task<IResult> CreatePost(
        [FromBody] CreatePostCommand command,
        IMessageBus bus,
        CancellationToken cancellationToken)
    {
        try
        {
            var result = await bus.InvokeAsync<CreatePostResponse>(command, cancellationToken);
            return Results.Created($"/api/posts/{result.Id}", result);
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
        catch (ArgumentException ex)
        {
            return Results.BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return Results.Problem(
                ex.InnerException?.Message ?? ex.Message,
                title: "An error occurred while creating the post",
                statusCode: 500);
        }
    }

    private static async Task<IResult> GetPost(
        Guid id,
        IMessageBus bus,
        CancellationToken cancellationToken)
    {
        try
        {
            if (id == Guid.Empty) return Results.BadRequest("Invalid post ID");

            var result = await bus.InvokeAsync<GetPostResponse>(new GetPostQuery(id), cancellationToken);
            return Results.Ok(result);
        }
        catch (ArgumentException ex)
        {
            return Results.NotFound(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return Results.Problem(
                ex.Message,
                title: "An error occurred while getting the post",
                statusCode: 500);
        }
    }

    private static async Task<IResult> UpdatePost(
        Guid id,
        [FromBody] UpdatePostResponse request,
        IMessageBus bus,
        CancellationToken cancellationToken)
    {
        try
        {
            if (id == Guid.Empty) return Results.BadRequest("Invalid post ID");

            var command = new UpdatePostCommand(id, request.Title, request.Content);
            var result = await bus.InvokeAsync<UpdatePostResponse>(command, cancellationToken);
            return Results.Ok(result);
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
        catch (ArgumentException ex)
        {
            return Results.NotFound(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return Results.Problem(
                ex.InnerException?.Message ?? ex.Message,
                title: "An error occurred while updating the post",
                statusCode: 500);
        }
    }

    private static async Task<IResult> DeletePost(
        Guid id,
        IMessageBus bus,
        CancellationToken cancellationToken)
    {
        try
        {
            if (id == Guid.Empty) return Results.BadRequest("Invalid post ID");

            await bus.InvokeAsync(new DeletePostCommand(id), cancellationToken);
            return Results.NoContent();
        }
        catch (ArgumentException ex)
        {
            return Results.NotFound(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return Results.Problem(
                ex.Message,
                title: "An error occurred while deleting the post",
                statusCode: 500);
        }
    }

    private static async Task<IResult> GetPostsByUser(
        Guid userId,
        IMessageBus bus,
        CancellationToken cancellationToken)
    {
        try
        {
            if (userId == Guid.Empty) return Results.BadRequest("Invalid user ID");

            var result =
                await bus.InvokeAsync<IEnumerable<GetPostResponse>>(new GetPostsByUserQuery(userId), cancellationToken);
            return Results.Ok(result);
        }
        catch (ArgumentException ex)
        {
            return Results.NotFound(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return Results.Problem(
                ex.Message,
                title: "An error occurred while getting user posts",
                statusCode: 500);
        }
    }

    private static async Task<IResult> BulkUpdatePosts(
        Guid userId,
        [FromBody] IEnumerable<UpdatePostRequest> request,
        IMessageBus bus,
        CancellationToken cancellationToken)
    {
        try
        {
            if (userId == Guid.Empty)
                return Results.BadRequest("Invalid user ID");

            var command = new BulkUpdatePostsCommand(userId, request);

            var result = await bus.InvokeAsync<BulkUpdatePostsResponse>(command, cancellationToken);
            return Results.Ok(result);
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
        catch (ArgumentException ex)
        {
            return Results.BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return Results.Problem(
                ex.InnerException?.Message ?? ex.Message,
                title: "An error occurred while bulk updating posts",
                statusCode: 500);
        }
    }
}
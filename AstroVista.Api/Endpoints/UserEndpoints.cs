using AstroVista.API.Endpoints.Common;
using AstroVista.Application.Users.Commands;
using AstroVista.Application.Users.Queries;
using AstroVista.Application.Users.Responses;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace AstroVista.API.Endpoints
{
    public static class UserEndpoints
    {
        public static IEndpointRouteBuilder MapUserEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapApiGroup("/api/users", "Users");

            group.MapPost("/", CreateUser)
                .WithName("CreateUser")
                .Produces<CreateUserResponse>(StatusCodes.Status201Created)
                .ProducesProblem(StatusCodes.Status400BadRequest)
                .ProducesProblem(StatusCodes.Status500InternalServerError);
            
            group.MapGet("/{id:guid}", GetUser)                
                .WithName("GetUser")
                .Produces<GetUserResponse>()
                .ProducesProblem(StatusCodes.Status400BadRequest)
                .ProducesProblem(StatusCodes.Status404NotFound)
                .ProducesProblem(StatusCodes.Status500InternalServerError);

            group.MapDelete("/{id:guid}", DeleteUser)
                .WithName("DeleteUser")
                .Produces(StatusCodes.Status204NoContent)
                .Produces(StatusCodes.Status404NotFound)
                .ProducesProblem(StatusCodes.Status500InternalServerError);

            return app;
        }


        private static async Task<IResult> CreateUser(
            [FromBody]CreateUserCommand command,
            IMessageBus bus,
            CancellationToken cancellationToken)
        {
            try
            {
                var result = await bus.InvokeAsync<CreateUserResponse>(command, cancellationToken);
                return Results.Created($"/api/users/{result.UserId}", result);
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
                return Results.Problem(
                    detail: ex.InnerException?.Message ?? ex.Message,
                    title: "An error occurred while creating the user",
                    statusCode: 500);
            }
        }
        
        private static async Task<IResult> GetUser(
            Guid id,
            IMessageBus bus,
            CancellationToken cancellationToken)
        {
            try
            {
                var result = await bus.InvokeAsync<GetUserResponse>(new GetUserByIdQuery(id), cancellationToken);

                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return Results.Problem(
                    detail: ex.Message,
                    title: "An error occurred while getting the user by id",
                    statusCode: 500);
            }
        }
        
        
        private static async Task<IResult> DeleteUser(
            Guid id, 
            IMessageBus bus,
            CancellationToken cancellationToken)
        {
            try
            {
                if (id == Guid.Empty) return Results.NotFound();
                
                await bus.InvokeAsync(new DeleteUserCommand(id), cancellationToken);
                return Results.NoContent();
            }
            catch (Exception ex)
            {
                return Results.Problem($"Error deleting user: {ex.Message}");
            }
        }
    }
}
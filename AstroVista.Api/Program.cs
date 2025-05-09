using AstroVista.Api.Endpoints;
using AstroVista.API.Endpoints;
using AstroVista.Application.Users.Commands;
using AstroVista.Core.Interfaces.ExternalApis;
using AstroVista.Core.Interfaces.Repositories;
using AstroVista.Infrastructure.Data.Context;
using AstroVista.Infrastructure.Data.Repositories;
using AstroVista.Infrastructure.ExternalApis;
using AstroVista.Infrastructure.ExternalApis.NasaApi;
using Microsoft.EntityFrameworkCore;
using Wolverine;
using Wolverine.EntityFrameworkCore;
using Wolverine.FluentValidation;
using Wolverine.Postgresql;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("AstroVistaDb")!;

builder.Services.AddScoped<IUserRepository, UserRepository>();

builder.Services.AddHttpClient<INasaApodClient, NasaApodClient>();
builder.Services.AddHttpClient<INasaImagesClient, NasaImagesClient>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Development", policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Host.UseWolverine(opts =>
{
    opts.PersistMessagesWithPostgresql(connectionString);
    opts.UseEntityFrameworkCoreTransactions();
    
    opts.UseFluentValidation();
    
    opts.Discovery.IncludeAssembly(typeof(CreateUserCommand).Assembly);
    
    opts.Durability.Mode = DurabilityMode.MediatorOnly;
});

builder.Services.AddDbContext<AstroVistaDbContext>(opt
        => opt.UseNpgsql(connectionString), 
    optionsLifetime: ServiceLifetime.Singleton);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.MapUserEndpoints();
app.MapNasaApodEndpoints();
app.MapNasaImageEndpoints();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("Development");
}

app.Run();
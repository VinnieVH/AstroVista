using AstroVista.Infrastructure.Data.Context;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AstroVistaDbContext>(opt 
    => opt.UseNpgsql(builder.Configuration.GetConnectionString("AstroVistaDb")));

builder.AddGraphQL().AddTypes();

var app = builder.Build();

app.MapGraphQL();

app.RunWithGraphQLCommands(args);
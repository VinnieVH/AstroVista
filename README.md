# AstroVista

AstroVista/
├── src/
│   ├── AstroVista.Api/                  # GraphQL API entry point (ASP.NET Core Minimal API)
│   │   ├── Program.cs
│   │   ├── Startup.cs
│   │   ├── GraphQL/                     # GraphQL schema definitions
│   │   │   ├── Queries/
│   │   │   ├── Mutations/
│   │   │   ├── Types/
│   │   │   └── AstroVistaSchema.cs
│   │   └── Middleware/                  # API middleware components
│   │
│   ├── AstroVista.Core/                 # Business domain and logic
│   │   ├── Entities/                    # Domain entities
│   │   ├── Interfaces/                  # Core interfaces (repositories, services)
│   │   ├── DTOs/                        # Data transfer objects
│   │   └── Services/                    # Business logic implementations
│   │
│   ├── AstroVista.Infrastructure/       # External services implementation
│   │   ├── Data/                        # Data access
│   │   │   ├── Repositories/            # Repository implementations
│   │   │   └── Context/                 # DB context if needed
│   │   ├── ExternalApis/                # NASA API client implementations
│   │   │   ├── NasaApodClient.cs
│   │   │   ├── MarsRoverClient.cs
│   │   │   └── NasaApiBase.cs
│   │   └── Services/                    # External service implementations
│   │
│   ├── AstroVista.Shared/               # Cross-cutting concerns
│       ├── Extensions/                  # Extension methods
│       ├── Constants/                   # Shared constants
│       └── Utilities/                   # Helper functions
│
├── tests/
│   ├── AstroVista.UnitTests/            # Unit tests
│   ├── AstroVista.IntegrationTests/     # Integration tests
│   └── AstroVista.GraphQLTests/         # GraphQL schema tests
│
└── client/                              # Next.js frontend (could be in separate repo)
    ├── src/
    ├── public/
    └── package.json

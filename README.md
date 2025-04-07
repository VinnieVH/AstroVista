# AstroVista - Space Exploration Platform

AstroVista is a comprehensive space exploration web application that integrates with NASA APIs to bring the universe to your fingertips. This platform allows users to explore astronomical imagery, mission data, and celestial phenomena through an intuitive interface powered by Next.js and a GraphQL API.

## Architecture Overview

AstroVista follows a clean architecture approach with a GraphQL backend serving a Next.js frontend:

- **Frontend**: Next.js application with React components
- **Backend**: .NET minimal API with GraphQL endpoint
- **Data Sources**: NASA APIs and other space-related data services

## Solution Structure

```
AstroVista/
├── AstroVista.Api/                  # GraphQL API entry point (ASP.NET Core Minimal API)
│   ├── Program.cs
│   ├── Startup.cs
│   ├── GraphQL/                     # GraphQL schema definitions
│   │   ├── Queries/
│   │   ├── Mutations/
│   │   ├── Types/
│   │   └── AstroVistaSchema.cs
│   └── Middleware/                  # API middleware components
│
├── AstroVista.Core/                 # Business domain and logic
│   ├── Entities/                    # Domain entities
│   ├── Interfaces/                  # Core interfaces (repositories, services)
│   ├── DTOs/                        # Data transfer objects
│   └── Services/                    # Business logic implementations
│
├── AstroVista.Infrastructure/       # External services implementation
│   ├── Data/                        # Data access
│   │   ├── Repositories/            # Repository implementations
│   │   └── Context/                 # DB context if needed
│   ├── ExternalApis/                # NASA API client implementations
│   │   ├── NasaApodClient.cs
│   │   ├── MarsRoverClient.cs
│   │   └── NasaApiBase.cs
│   └── Services/                    # External service implementations
│
├── AstroVista.Shared/               # Cross-cutting concerns
│   ├── Extensions/                  # Extension methods
│   ├── Constants/                   # Shared constants
│   └── Utilities/                   # Helper functions
│
├── tests/
│   ├── AstroVista.UnitTests/            # Unit tests
│   ├── AstroVista.IntegrationTests/     # Integration tests
│   └── AstroVista.GraphQLTests/         # GraphQL schema tests
│
└── client/                              # Next.js frontend
    ├── src/
    ├── public/
    └── package.json
```

## Key Components

### Backend (.NET Core)

The backend is structured around the following projects:

#### AstroVista.Api
- GraphQL API endpoint using Hot Chocolate or GraphQL.NET
- Minimal API setup with middleware configurations
- Authentication and authorization handlers

#### AstroVista.Core
- Business domain entities and logic
- Service interfaces and implementations
- Domain Transfer Objects (DTOs)

#### AstroVista.Infrastructure
- NASA API integrations with proper rate-limiting and caching
- Repository implementations
- External service adapters

#### AstroVista.Shared
- Utilities and helpers used across the solution
- Common extensions and constants

### Frontend (Next.js)

The frontend is a Next.js application that communicates with the GraphQL API to render space-related content:

- React components for various space views (planets, missions, images)
- Apollo Client for GraphQL communication
- Responsive design for desktop and mobile experiences

## Features

- Astronomy Picture of the Day exploration
- Mars rover imagery and mission data
- Interactive solar system visualization
- Space mission timelines and details
- Celestial event calendar
- User favorites and collections

## Getting Started

### Backend Setup
1. Clone the repository
2. Navigate to the `src/AstroVista.Api` directory
3. Create a `appsettings.Development.json` file with your NASA API key
4. Run the API with `dotnet run`

### Frontend Setup
1. Navigate to the `client` directory
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`
4. Access the application at `http://localhost:3000`

## Development Workflow

- Backend and frontend can be developed independently
- GraphQL schema provides a clear contract between front and back ends
- Use GraphQL playground at `/graphql` for API exploration and testing

## Why GraphQL?

AstroVista uses GraphQL to provide a unified interface to multiple NASA APIs, enabling:
- Precise data fetching for different UI views
- Reduced network overhead
- Rich exploratory queries for connecting space-related data
- Flexibility for evolving UI requirements

## Testing

- Unit tests: `dotnet test tests/AstroVista.UnitTests`
- Integration tests: `dotnet test tests/AstroVista.IntegrationTests`
- GraphQL schema tests: `dotnet test tests/AstroVista.GraphQLTests`
- Frontend tests: `cd client && npm test`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- NASA for providing open APIs and data
- The .NET and Next.js communities for excellent frameworks
- All contributors and space enthusiasts

---

Explore the cosmos with AstroVista! 🚀🌌

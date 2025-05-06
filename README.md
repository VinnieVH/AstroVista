# AstroVista - Space Exploration Platform
AstroVista is a comprehensive space exploration web application that integrates with NASA APIs to bring the universe to your fingertips. This platform allows users to explore astronomical imagery, mission data, and celestial phenomena through an intuitive interface powered by Angular and a GraphQL API.
## Architecture Overview
AstroVista follows a clean architecture approach with a GraphQL backend serving an Angular frontend:

Frontend: Angular 19 application with component-based architecture
Backend: .NET minimal API with GraphQL endpoint using Hot Chocolate
Data Sources: NASA APIs and other space-related data services

## Solution Structure

```
AstroVista/
├── AstroVista.API/                 # .NET Core Minimal API project
│   ├── Endpoints/                  # Organized API endpoints by feature
│   │   └── Common/                 # Common endpoint utilities
│   ├── Middleware/                 # Custom middleware components
│   ├── Filters/                    # API filters
│   ├── Program.cs                  # Application entry point and Wolverine setup
│   ├── appsettings.json            # Configuration
│   └── Properties/
│
├── AstroVista.Core/                # Core domain, entities, interfaces
│   ├── Entities/                   # Domain entities
│   ├── Interfaces/                 # Core interfaces (repositories, services)
│   ├── Exceptions/                 # Domain-specific exceptions
│   └── ValueObjects/               # Value objects for the domain
│
├── AstroVista.Application/         # Use cases, message handlers
│   ├── DTOs/                       # Data Transfer Objects
│   ├── Interfaces/                 # Application service interfaces
│   ├── Mappings/                   # AutoMapper profiles
│   ├── Features/                   # CQRS features organized by domain concepts
│   │   ├── Users/       
│   │   │   ├── Commands/           # Command messages
│   │   │   ├── Queries/            # Query messages
│   │   │   └── Handlers/           # Wolverine message handlers
│   │   ├── Observations/
│   │   │   ├── Commands/
│   │   │   ├── Queries/
│   │   │   └── Handlers/
│   │   ├── CelestialBodies/
│   │   │   ├── Commands/
│   │   │   ├── Queries/
│   │   │   └── Handlers/
│   │   └── Auth/
│   │       ├── Commands/
│   │       └── Handlers/
│   ├── Behaviors/                  # Wolverine pipeline behaviors
│   ├── Common/                     # Shared application utilities
│   ├── DependencyInjection.cs      # Registers application services
│   └── WolverineRegistry.cs        # Wolverine configuration
│
├── AstroVista.Infrastructure/      # Data access, external services
│   ├── Data/
│   │   ├── Configurations/         # Entity Framework configurations
│   │   ├── Repositories/           # Repository implementations
│   │   ├── AstroVistaDbContext.cs
│   │   └── Migrations/
│   ├── Services/                   # External service implementations
│   ├── DependencyInjection.cs      # Infrastructure dependency registration
│   └── Identity/                   # Authentication/authorization
│
├── AstroVista.Client/              # Angular 19 frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/               # Core module
│   │   │   ├── shared/             # Shared module
│   │   │   ├── features/           # Feature modules
│   │   │   ├── layout/             # Layout components
│   │   │   ├── app-routing.module.ts
│   │   │   ├── app.component.ts
│   │   │   └── app.module.ts
│   │   ├── assets/                 # Static assets
│   │   ├── environments/           # Environment configurations
│   │   ├── index.html
│   │   └── styles.scss
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
│
└── tests/                          # Test projects
    ├── AstroVista.UnitTests/
    ├── AstroVista.IntegrationTests/
    └── AstroVista.E2ETests/    
```
## Key Components
### Backend (.NET Core)
The backend is structured around the following projects:
AstroVista.Api

GraphQL API endpoint using Hot Chocolate
Minimal API setup with middleware configurations
Authentication and authorization handlers

### AstroVista.Core

Business domain entities and logic
Service interfaces and implementations
Domain Transfer Objects (DTOs)

### AstroVista.Infrastructure

NASA API integrations with proper rate-limiting and caching
Repository implementations
External service adapters

### AstroVista.Shared

Utilities and helpers used across the solution
Common extensions and constants

### Frontend (Angular 19)
The frontend is an Angular 19 application that communicates with the GraphQL API to render space-related content:

Component-based architecture for various space views (planets, missions, images)
Apollo Client for GraphQL communication
Responsive design for desktop and mobile experiences
Standalone components using Angular 19's latest features
Signal-based state management

## Features

Astronomy Picture of the Day exploration
Mars rover imagery and mission data
Interactive solar system visualization
Space mission timelines and details
Celestial event calendar
User favorites and collections

## Getting Started
### Backend Setup

1. Clone the repository
2. Navigate to the src/AstroVista.Api directory
3. Create an appsettings.Development.json file with your NASA API key
4. Run the API with dotnet run

### Frontend Setup

1. Navigate to the client directory
2. Install dependencies with npm install
3. Start the development server with ng serve
4. Access the application at http://localhost:4200

### Development Workflow

- Backend and frontend can be developed independently
- GraphQL schema provides a clear contract between front and back ends
- Use GraphQL playground at /graphql for API exploration and testing

## Why GraphQL?
AstroVista uses GraphQL to provide a unified interface to multiple NASA APIs, enabling:

Precise data fetching for different UI views
Reduced network overhead
Rich exploratory queries for connecting space-related data
Flexibility for evolving UI requirements

## Testing

Unit tests: dotnet test tests/AstroVista.UnitTests
Integration tests: dotnet test tests/AstroVista.IntegrationTests
GraphQL schema tests: dotnet test tests/AstroVista.GraphQLTests
Frontend tests: cd client && ng test

## License
This project is licensed under the MIT License - see the LICENSE file for details.
Acknowledgments

## NASA for providing open APIs and data
The .NET and Angular communities for excellent frameworks
All contributors and space enthusiasts

---

Explore the cosmos with AstroVista! 🚀🌌
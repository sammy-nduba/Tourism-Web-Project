# Wild Horizon Adventures

A production-ready web application for adventure travel and conservation programs across East Africa, featuring tours and programs in Kenya, Uganda, Tanzania, and Rwanda.

## Architecture

This project follows Clean Architecture principles with clear separation of concerns:

- **Presentation Layer**: React components, pages, hooks, and UI logic
- **Domain Layer**: Business logic, use cases, and domain models
- **Data Layer**: API services, repositories, and data transformation

## Project Structure

```
src/
├── presentation/        # UI components, pages, routes
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   └── hooks/         # Custom React hooks
├── domain/             # Business logic and models
│   ├── models/        # Domain models and interfaces
│   ├── usecases/      # Business use cases
│   └── ports/         # Interfaces for repositories and services
├── data/               # External data sources
│   ├── services/      # API service implementations
│   ├── repositories/  # Data access layer
│   ├── dto/          # Data transfer objects
│   └── mocks/        # Mock data for development
└── shared/             # Shared utilities and constants
    ├── utils/
    ├── constants/
    └── types/
```

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Run tests**:
   ```bash
   npm test
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Features

- **Country Exploration**: Detailed pages for Kenya, Uganda, Tanzania, and Rwanda
- **Adventure Tours**: Comprehensive tour listings with detailed information
- **Conservation Programs**: Volunteer and conservation project information
- **Blog & Stories**: Latest news and adventure stories
- **Donation System**: Get involved and support conservation efforts
- **Search Functionality**: Find tours, destinations, and content
- **Responsive Design**: Mobile-first approach with accessibility features

## API Services

Each major section has its own service:

- `CountriesService`: Country and destination data
- `CitiesService`: City information and highlights
- `ToursService`: Tour listings and details
- `ProgramsService`: Conservation and volunteer programs
- `BlogService`: Blog posts and stories
- `ContactService`: Contact form submissions
- `DonateService`: Donation processing
- `SearchService`: Global search functionality

## Development

The application uses mock data during development. All services are designed to easily switch to real API endpoints by updating the service implementations.

To add a new service:

1. Create the service in `src/data/services/`
2. Define the domain models in `src/domain/models/`
3. Create the repository interface in `src/domain/ports/`
4. Implement the use case in `src/domain/usecases/`
5. Add mock data in `src/data/mocks/`

## Deployment

The application is configured for deployment on Vercel or Netlify. Build artifacts are generated in the `dist/` directory.

## Contributing

1. Follow the established architecture patterns
2. Ensure all new code includes TypeScript types
3. Add unit tests for business logic
4. Follow the existing code style and naming conventions
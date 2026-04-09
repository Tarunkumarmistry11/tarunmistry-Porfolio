# AI Copilot Instructions

## Project Overview
This is a Node.js/Express REST API backend for a portfolio application. The project is in early development with a structured MVC-style architecture ready for implementation.

### Tech Stack
- **Runtime**: Node.js (CommonJS)
- **Framework**: Express.js v5.2.1
- **Database**: MongoDB with Mongoose v9.4.1
- **Development**: Nodemon for auto-reload
- **Utilities**: CORS, dotenv for environment configuration

## Architecture & Components

### Directory Structure Conventions
```
backend/
├── server.js          # Express app initialization and middleware setup
├── config/            # Configuration files (database connection)
├── controllers/       # Business logic handlers (aboutController, projectController)
├── middleware/        # Custom middleware (errorHandler)
├── models/            # Mongoose schemas (About, Project)
├── routes/            # Route definitions for API endpoints
└── seed/              # Database seeding scripts
```

### MVC Pattern
- **Models** (`models/`): Define Mongoose schemas for About and Project entities
- **Controllers** (`controllers/`): Implement request handlers following REST conventions
- **Routes** (`routes/`): Wire controllers to HTTP endpoints

### Data Entities
Two main domains currently:
- **About**: Likely for portfolio/profile information
- **Project**: Portfolio projects with details

## Development Workflow

### Running the Application
- **Development**: `npm run dev` - Starts with Nodemon hot-reload on file changes
- **Production**: `npm start` - Runs server.js directly

### Expected Server Configuration
- Database connection handled in `config/db.js`
- Environment variables loaded via dotenv
- CORS enabled for cross-origin requests
- Centralized error handling via `middleware/errorHandler.js`

### Database Setup
- Use `seed/seed.js` to populate initial data
- Mongoose models should export schemas for reuse in seed scripts

## Implementation Patterns

### Controller Pattern
Controllers should:
- Accept (req, res) parameters
- Use async/await for database operations
- Pass errors to errorHandler middleware
- Example: `aboutController` handles About entity CRUD operations

### Route Pattern
Routes should:
- Use descriptive endpoint names (e.g., `/api/about`, `/api/projects`)
- Map HTTP methods to controller functions
- Example: `aboutRoutes.js` exports router for about-related endpoints

### Error Handling
- Centralize error handling in `middleware/errorHandler.js`
- Controllers should throw or pass errors to middleware
- All endpoints should have try-catch blocks for async operations

## Key Files to Reference
- [package.json](../backend/package.json) - Dependencies and scripts
- [server.js](../backend/server.js) - App entry point and middleware configuration
- [config/db.js](../backend/config/db.js) - MongoDB connection setup
- [middleware/errorHandler.js](../backend/middleware/errorHandler.js) - Global error handler

## Common Tasks

### Adding a New Feature
1. Create Mongoose model in `models/`
2. Create controller in `controllers/` with CRUD functions
3. Create routes in `routes/` mapping to controller functions
4. Mount routes in `server.js` using `app.use()`
5. Test endpoints before committing

### Debugging
- Check terminal output from `npm run dev` for Nodemon auto-reload issues
- Verify MongoDB connection string in environment variables
- Use console.log for debugging async operations in controllers

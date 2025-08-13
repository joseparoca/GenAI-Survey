# Replit.md

## Overview

This is a GenAI adoption survey platform built with a React frontend and Express.js backend. The application facilitates surveys for organizations to understand Generative AI adoption within their companies. It provides separate workflows for company representatives (who register and manage surveys) and employees (who complete the actual surveys).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite with custom configuration

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Authentication**: Session-based authentication
- **Password Hashing**: bcrypt for secure password storage

## Recent Changes (July 2025)
- **Removed survey questions** (July 30, 2025): Removed three questions from employee survey based on user request:
  - "How long have you been at your current role?" (roleTenure field)
  - Confidence ratings section ("How confident are you that AI tools can provide...")
  - "How do you learn about new use-cases of GenAI?" (learningMethods field)
  - Updated database schema, interface definitions, validation logic, and form fields accordingly
- **Replaced development area question** (July 30, 2025): Changed "What is your primary area of development?" to percentage-based time allocation:
  - New question asks for percentage of time spent across 10 different work categories
  - Categories include planned/unplanned activities, training, and administrative tasks
  - Changed from percentage inputs to radio button matrix with ranges: <10%, 10-20%, 20-40%, 40-60%, 60-80%, 80%+
  - Each activity row requires one percentage range selection
  - Database field changed from developmentArea to timeAllocation (jsonb structure storing string values)

## Recent Changes (August 2025)
- **Implemented "None of the above" checkbox logic** (August 4, 2025):
  - When "None of the above" or similar options are selected, all other checkboxes are automatically unchecked except for "Other" options
  - When any regular option is selected, "None of the above" options are automatically unchecked
  - Applied to multiple checkbox questions across all survey types:
    - Company Participation Survey: initiatives field
    - Employee Survey: managerSupportMethods and concerns fields
    - Company Survey: initiatives and barriers fields
  - Ensures logical consistency in survey responses where "none" options are mutually exclusive with specific selections

## Recent Changes (January 2025)
- Fixed session persistence issues in company registration and login flows
- Added explicit session saving to ensure authentication persists across page navigation
- Enhanced dashboard to correctly display completed employee survey counts
- Added debugging logs for tracking authentication and survey completion
- Fixed expectedParticipants field to only accept numbers and properly convert to integer
- **Implemented Permanent Survey Closure** (January 14, 2025):
  - Added `permanentlyClosed` field to companies table to track permanent closure status
  - Surveys can now be permanently closed and cannot be reopened once closed
  - Added confirmation dialog with professional warning message when closing surveys
  - Updated UI to clearly indicate when a survey is permanently closed
  - Toggle switch is disabled for permanently closed surveys
  - Backend enforces one-way closure logic preventing reopening attempts
  - All existing data remains preserved and accessible after permanent closure
- Fixed field name mapping between frontend and backend (primaryRoles → employeeRoles, etc.)
- Company registration now correctly saves all survey data including email/password collected in section 4
- Fixed critical privacy issue where new employees could see previous employee's survey data
- Implemented proper session isolation between different employee survey responses
- Fixed continuation code system to properly load saved survey progress when employees return
- Added responseId tracking to correctly fetch employee's own saved data
- **Fixed TanStack Query caching issue** (July 30, 2025): Resolved persistent data crossover between employees by:
  - Setting staleTime: 0 and refetchOnMount: 'always' on survey queries
  - Using removeQueries() instead of invalidateQueries() to completely clear cache on login
  - Adding session verification to prevent loading data from different employees
  - Ensuring complete data isolation between different employee sessions
- **Implemented Team Sorting by Maturity Score** (January 14, 2025):
  - Teams in analytics dashboard now appear sorted from highest to lowest AI maturity score
  - Best performing teams appear first (left) in the distribution table
  - Maturity score calculated as weighted average of level distributions
  - Makes it easier to identify leading teams and those needing support

## Key Components

### Database Schema
The application uses two main tables:
- **Companies**: Stores company registration data, survey responses, and unique access codes
- **Employee Responses**: Stores individual employee survey responses linked to companies (anonymous by default, optional email)

### Authentication System
- **Company Authentication**: Email/password login with session management
- **Employee Authentication**: Company access code only (no email required)
- **Anonymous Sessions**: Uses anonymousId and continuationCode for survey persistence
- **Session Management**: Express sessions with PostgreSQL session store

### Survey System
- **Multi-section Surveys**: Progress tracking with section-based navigation
- **Data Persistence**: Auto-save functionality with continuation codes for anonymous users
- **Validation**: Zod schema validation for all form inputs
- **Anonymous Participation**: Employees can complete surveys without providing email
- **Optional Email Opt-in**: Users can provide email after completion for personalized insights

## Data Flow

1. **Company Registration Flow**:
   - Company signs up with email/password
   - Completes organizational survey
   - Receives unique access code
   - Can view dashboard with employee participation stats

2. **Employee Survey Flow**:
   - Employee enters company access code only (no email required)
   - System generates anonymous ID and continuation code
   - Can resume survey using continuation code
   - Multi-section survey with progress tracking
   - Data saved incrementally and marked complete when finished
   - Optional email collection after completion for personalized insights

3. **Data Storage**:
   - All survey data stored in PostgreSQL via Drizzle ORM
   - Session data persisted for resumable surveys
   - Company access codes ensure data isolation

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations
- **Database Migrations**: Managed through drizzle-kit

### UI Components
- **shadcn/ui**: Pre-built accessible React components
- **Radix UI**: Headless UI primitives
- **Lucide React**: Icon library

### Development Tools
- **Vite**: Build tool with HMR
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Backend bundling for production

## Deployment Strategy

### Development
- **Local Development**: tsx for TypeScript execution
- **Hot Reload**: Vite dev server with backend proxy
- **Database**: Neon database connection via environment variables

### Production Build
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Static Serving**: Express serves built frontend assets
- **Environment**: Production mode with optimized builds

### Configuration
- **Environment Variables**: DATABASE_URL for database connection
- **Path Aliases**: TypeScript paths for clean imports
- **CORS**: Configured for cross-origin requests in development

The application follows a traditional client-server architecture with clear separation between frontend React app and backend Express API, connected through RESTful endpoints and backed by a PostgreSQL database.
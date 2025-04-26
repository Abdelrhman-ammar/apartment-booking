# Apartment Booking Application

A full-stack application for browsing and managing apartment listings. The application consists of a Next.js frontend and a Node.js/Express backend with PostgreSQL database.

## Project Structure

The project is divided into two main parts:

### Frontend (`apartment-booking`)

The frontend is built with Next.js 15 and uses React 19. It follows the App Router pattern introduced in Next.js 13+.

```
apartment-booking/
├── public/                  # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/                 # Next.js App Router structure
│   │   ├── apartment/[id]/  # Dynamic route for apartment details
│   │   │   └── page.tsx     # Apartment details page
│   │   ├── favicon.ico      # Favicon icon
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout component
│   │   └── page.tsx         # Home page component
│   ├── components/          # Reusable React components
│   │   ├── ApartmentCard.tsx
│   │   ├── Footer.tsx
│   │   ├── Icons.tsx
│   │   ├── Navbar.tsx
│   │   └── Pagination.tsx
│   ├── lib/                 # Utility functions and API clients
│   │   └── api.ts           # API client for backend communication
│   ├── public/              # Additional public assets (empty)
│   └── types/               # TypeScript type definitions
│       └── apartment.ts     # Types for apartment data
├── Dockerfile               # Docker configuration for frontend
├── docker-entrypoint.sh     # Docker entry point script
├── next.config.ts           # Next.js configuration
└── package.json             # Project dependencies and scripts
```

### Backend (`apartment-booking-api`)

The backend is built with Node.js, Express, and Prisma ORM with a PostgreSQL database.

```
apartment-booking-api/
├── prisma/                  # Prisma ORM configuration
│   ├── migrations/          # Database migrations
│   └── schema.prisma        # Database schema
├── src/
│   ├── controllers/         # Request handlers
│   │   ├── apartment.controller.ts
│   │   └── users.contoller.ts
│   ├── middlewares/         # Express middlewares
│   │   ├── auth.middleware.ts
│   │   └── not-found-enpoint.middleware.ts
│   ├── models/              # Data models
│   │   ├── apartment.ts
│   │   └── user.ts
│   ├── prisma/              # Prisma client and schema
│   │   ├── client.ts
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.ts          # Database seed script
│   ├── routes/              # API routes
│   │   ├── apartment.routes.ts
│   │   ├── not-found-endoint.routs.ts
│   │   └── user.routes.ts
│   ├── services/            # Business logic
│   │   ├── apartment.service.ts
│   │   └── user.service.ts
│   ├── types/               # TypeScript type definitions
│   │   └── validation-object.ts
│   └── utils/               # Utility functions
│       ├── connect-db.ts
│       ├── hash.ts
│       ├── jwt.ts
│       ├── response.ts
│       └── status-responses.ts
├── Dockerfile               # Docker configuration for backend
├── docker-entrypoint.sh     # Docker entry point script
└── package.json             # Project dependencies and scripts
```

## Database Seeding

The application includes a database seeding mechanism that populates the database with initial data for testing and development purposes. The seeding process is automatically executed when the Docker container starts, but only if it hasn't been run before (controlled by a flag file).

### Seed Data

The seed script creates the following data:

#### User
- User (name: Apdelrhman Ammar, email: abdelrhmanammar.cs@gmail.com, phone: 01122285075, password: password, role: USER)

#### Apartments
The seed script creates 20 different apartments with varied properties.

### Running the Seed Manually

You can manually run the seed script with the following command:

```bash
npm run prisma:seed
```

## Backend API Documentation

The backend provides a RESTful API for managing apartments and users. Here are the main endpoints:

### Apartment Endpoints

| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|------------------------|
| GET | `/api/apartments` | Get all apartments with pagination | No |
| GET | `/api/apartments/:id` | Get a specific apartment by ID | No |
| POST | `/api/apartments/filter` | Filter apartments based on criteria | No |
| POST | `/api/apartments` | Create a new apartment | Yes |
| PUT | `/api/apartments/:id` | Update an existing apartment | Yes (Owner or Admin) |
| DELETE | `/api/apartments/:id` | Delete an apartment | Yes (Owner or Admin) |

### User Endpoints

| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|------------------------|
| POST | `/api/users/register` | Register a new user | No |
| POST | `/api/users/login` | Login and get authentication token | No |
| GET | `/api/users/profile` | Get user profile information | Yes |
| PUT | `/api/users/profile` | Update user profile information | Yes |

### Request Body for POST `/api/users/register`

```json
{
  "username": "string",      // Required: Username for the account
  "email": "string",         // Required: Email address
  "password": "string",      // Required: Password (will be hashed)
  "firstName": "string",     // Optional: User's first name
  "lastName": "string",      // Optional: User's last name
  "phone": "string"          // Optional: Phone number
}
```

### Request Body for POST `/api/users/login`

```json
{
  "email": "string",         // Required: Email address
  "password": "string"       // Required: Password
}
```

### Query Parameters for GET `/api/apartments`

- `page`: Page number for pagination (default: 1)
- `limit`: Number of items per page (default: 10, max: 50)

### Request Body for POST `/api/apartments/filter`

```json
{
  "unitName": "string",       // Optional: Filter by unit name
  "location": "string",       // Optional: Filter by location
  "minPrice": number,         // Optional: Minimum price
  "maxPrice": number,         // Optional: Maximum price
  "bedrooms": number,         // Optional: Number of bedrooms
  "bathrooms": number,        // Optional: Number of bathrooms
  "available": boolean,       // Optional: Availability status
  "minArea": number,          // Optional: Minimum area
  "maxArea": number,          // Optional: Maximum area
  "features": string[]        // Optional: Array of features
}
```

### Request Body for POST `/api/apartments`

```json
{
  "unitName": "string",       // Required: Name of the apartment unit
  "unitNumber": "string",     // Required: Unit number
  "project": "string",        // Required: Project name
  "description": "string",    // Required: Description
  "price": number,            // Required: Price
  "location": "string",       // Required: Location
  "bedrooms": number,         // Required: Number of bedrooms
  "bathrooms": number,        // Required: Number of bathrooms
  "area": number,             // Required: Area in square meters
  "available": boolean,       // Optional: Availability status (default: true)
  "features": string[],       // Optional: Array of features
  "images": string[]          // Optional: Array of image URLs
}
```

## API Components Explained

This section explains how the backend API components work together, focusing on the main operations: listing apartments, getting an apartment by ID, user registration, and authentication.

### Component Overview

#### 1. Model (`apartment.ts`)

The model defines the data structure for apartments and provides methods for validation and data transformation.

```typescript
// Key parts of the Apartment model
export default class Apartment {
  // Properties like id, unitName, price, etc.

  // Validates apartment data
  static validate(data: ApartmentParams): string | null {
    // Validation logic
  }

  // Transforms to database format
  toCreateObject(): Prisma.ApartmentCreateInput {
    // Transformation logic
  }

  // Transforms to API response format
  serializedObject(): Partial<ApartmentParams> {
    // Serialization logic
  }
}
```

**Purpose**: Defines the apartment data structure, validates data, and handles transformations between API and database formats.

#### 2. Service (`apartment.service.ts`)

The service contains the business logic and interacts with the database through Prisma ORM.

```typescript
// Key methods in ApartmentService
export class ApartmentService {
  // Gets all apartments with pagination
  async getAllApartments(page: number, limit: number) {
    // Retrieves apartments from database and formats response
  }

  // Gets a single apartment by ID
  async getApartmentById(id: number) {
    // Retrieves specific apartment and formats response
  }

  // Other methods for creating, updating, filtering, etc.
}
```

**Purpose**: Implements business logic, interacts with the database, and prepares data for the controller.

#### 3. Controller (`apartment.controller.ts`)

The controller handles HTTP requests and responses, extracting data from requests and using the service to process it.

```typescript
// Key controller methods
export const getApartments = async (req: Request, res: Response) => {
  // Extract pagination parameters
  const page = Math.max(Number(req.query?.page || req.body?.page) || 1, 1)
  const limit = Math.min(Number(req.query?.limit || req.body?.limit) || 10, 50)

  // Call service method
  const response = await apartmentService.getAllApartments(page, limit);

  // Send response
  res.status(response.status).json(response);
};

export const getApartment = async (req: Request, res: Response) => {
  // Extract apartment ID from URL parameters
  const apartmentId = Number(req.params.id);

  // Call service method
  const response = await apartmentService.getApartmentById(apartmentId);

  // Send response
  res.status(response.status).json(response);
};
```

**Purpose**: Handles HTTP requests/responses and delegates processing to the service layer.

#### 4. Routes (`apartment.routes.ts`)

The routes file defines the API endpoints and connects them to controller methods.

```typescript
// Key route definitions
const router = Router();

// List apartments endpoint
router.get('/', getApartments);

// Get apartment by ID endpoint
router.get('/:id', getApartment);

// Other endpoints for creating, updating, filtering, etc.
```

**Purpose**: Defines API endpoints and maps them to controller methods.

#### 5. Model (`user.ts`)

The user model defines the data structure for users and provides methods for validation and data transformation.

```typescript
// Key parts of the User model
export default class User {
  // Properties like id, username, email, password, etc.

  // Validates user data
  static validate(data: UserParams): string | null {
    // Validation logic
  }

  // Transforms to database format
  toCreateObject(): Prisma.UserCreateInput {
    // Transformation logic
  }

  // Transforms to API response format (excludes sensitive data like password)
  serializedObject(): Partial<UserParams> {
    // Serialization logic
  }
}
```

**Purpose**: Defines the user data structure, validates data, and handles transformations between API and database formats.

#### 6. Service (`user.service.ts`)

The user service contains the business logic for user operations and interacts with the database through Prisma ORM.

```typescript
// Key methods in UserService
export class UserService {
  // Registers a new user
  async registerUser(userData: UserRegisterParams) {
    // Validates data, hashes password, creates user in database
  }

  // Authenticates a user and generates JWT token
  async loginUser(email: string, password: string) {
    // Verifies credentials and generates authentication token
  }

  // Gets user profile
  async getUserProfile(userId: number) {
    // Retrieves user data and formats response
  }

  // Other methods for updating profile, etc.
}
```

**Purpose**: Implements user-related business logic, handles authentication, and interacts with the database.

### Request Flow Explained

#### Listing Apartments (GET /api/apartments)

1. **Request Received**: When a GET request is made to `/api/apartments`, the Express router directs it to the `getApartments` controller method.

2. **Controller Processing**: 
   - The controller extracts pagination parameters (`page` and `limit`) from the request
   - It calls the `getAllApartments` method of the service

3. **Service Processing**:
   - The service uses Prisma to query the database with pagination
   - It transforms the database results into Apartment objects
   - It formats the response with proper status codes and data

4. **Response Sent**: The controller sends the formatted response back to the client

#### Getting Apartment by ID (GET /api/apartments/:id)

1. **Request Received**: When a GET request is made to `/api/apartments/:id`, the Express router directs it to the `getApartment` controller method.

2. **Controller Processing**:
   - The controller extracts the apartment ID from the request parameters
   - It calls the `getApartmentById` method of the service

3. **Service Processing**:
   - The service validates the ID
   - It uses Prisma to query the database for the specific apartment
   - If found, it creates an Apartment object and formats a success response
   - If not found, it formats a not-found response

4. **Response Sent**: The controller sends the formatted response back to the client

#### User Registration (POST /api/users/register)

1. **Request Received**: When a POST request is made to `/api/users/register`, the Express router directs it to the user registration controller method.

2. **Controller Processing**:
   - The controller extracts user data from the request body
   - It calls the `registerUser` method of the user service

3. **Service Processing**:
   - The service validates the user data
   - It hashes the password for secure storage
   - It creates a new user in the database
   - It formats a success response with the new user data (excluding sensitive information)

4. **Response Sent**: The controller sends the formatted response back to the client

#### User Authentication (POST /api/users/login)

1. **Request Received**: When a POST request is made to `/api/users/login`, the Express router directs it to the user login controller method.

2. **Controller Processing**:
   - The controller extracts email and password from the request body
   - It calls the `loginUser` method of the user service

3. **Service Processing**:
   - The service retrieves the user by email
   - It verifies the password against the stored hash
   - If valid, it generates a JWT token
   - It formats a response with the token and user data

4. **Response Sent**: The controller sends the formatted response back to the client

This architecture follows the Model-View-Controller (MVC) pattern, with clear separation of concerns:
- **Model**: Defines data structure and validation
- **Service**: Implements business logic and database interactions
- **Controller**: Handles HTTP requests/responses
- **Routes**: Defines API endpoints

## Deployment Instructions

The application is containerized using Docker and can be deployed using Docker Compose.

### Prerequisites

- Docker and Docker Compose installed
- Git (for cloning the repository)

### Environment Variables

Create a `.env` file in the `apartment-booking-api` directory with the following variables:

```
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=apartment_booking
POSTGRES_PORT=5432
DATABASE_URL=postgresql://postgres:your_password@postgres-db:5432/apartment_booking?schema=public

# API Configuration
API_PORT=8000
JWT_SECRET=your_jwt_secret
```

### Deployment Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/apartment-booking.git
   cd apartment-booking
   ```

2. Start the application using Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. The application will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

### Docker Components

The Docker Compose setup includes three services:

1. **postgres**: PostgreSQL database
   - Persists data in a Docker volume
   - Exposes port 5432

2. **api**: Backend API service
   - Builds from the `apartment-booking-api` directory
   - Depends on the postgres service
   - Runs migrations on startup using the entrypoint script
   - Exposes port 8000

3. **frontend**: Next.js frontend
   - Builds from the `apartment-booking` directory
   - Depends on the api service
   - Configured to communicate with the API service
   - Exposes port 3000

## Development Setup

### Frontend Development

```bash
cd apartment-booking
npm install
npm run dev
```

The frontend development server will be available at http://localhost:3000.

### Backend Development

```bash
cd apartment-booking-api
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

The backend development server will be available at http://localhost:8000.

## Technologies Used

### Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Lucide React (for icons)

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JSON Web Tokens (JWT) for authentication

### DevOps
- Docker
- Docker Compose

## License

This project is licensed under the MIT License.
![Screenshot from 2025-04-26 17-07-18](https://github.com/user-attachments/assets/8f5ef9c4-6232-4a46-b342-7db0ff5b138b)
![Screenshot from 2025-04-26 17-07-07](https://github.com/user-attachments/assets/6c97318b-e2eb-407f-becf-701642643765)
![Screenshot from 2025-04-26 17-06-48](https://github.com/user-attachments/assets/1ee4b6fb-2819-40fa-af7e-3bd67e404983)
![test](https://github.com/user-attachments/assets/a562f713-79f5-4058-b0d5-a9672dad7138)
![test2](https://github.com/user-attachments/assets/bd84ee29-887a-46bf-b6e5-7944e20793ef)

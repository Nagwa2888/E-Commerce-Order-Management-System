# E-Commerce Order Management System

Senior Full Stack Developer Technical Assessment implementation using:
- Backend: .NET 8 Web API, EF Core, SQL Server, CQRS, Clean Architecture, JWT, Swagger, SignalR
- Frontend: Angular (modular architecture), Reactive Forms, Angular Material, route guards, HTTP interceptors
- Caching: in-memory + Redis hybrid cache

## 1. Solution Structure

- `src/backend`
	- `ECommerce.Domain`: Entities, enums, base abstractions
	- `ECommerce.Application`: CQRS commands/queries, DTOs, interfaces
	- `ECommerce.Infrastructure`: EF Core persistence, repositories, unit of work, security, caching
	- `ECommerce.API`: Controllers, middleware, SignalR hub, composition root
- `src/frontend`
	- `core`: models, services, guards, interceptors
	- `features/auth`: login
	- `features/products`: product listing/details/create/edit
	- `features/cart`: cart management
	- `features/orders`: checkout, order summary, notification center

## 2. Requirements Coverage

### Backend (.NET)

Implemented:
- .NET 8 Web API
- EF Core + SQL Server provider
- Clean architecture layering (Domain/Application/Infrastructure/API)
- CQRS with MediatR
- Unit of Work with explicit transaction boundaries for order creation
- JWT authentication and role-based authorization (`AdminOnly`, `CustomerOrAdmin`)
- Swagger/OpenAPI + JWT bearer scheme

Core order creation behavior implemented:
- Stock availability validation
- Discount application
- Stock deduction
- Subtotal/discount/total calculation
- Transactional consistency with rollback on failure
- Detailed order response payload

### Frontend (Angular)

Implemented:
- Angular app with modular architecture and lazy-loaded feature modules
- TypeScript + Angular Material UI
- Reactive forms for auth and product management
- JWT HTTP interceptor
- Global HTTP error interceptor
- Route guards (`auth`, `admin`)

Functional pages:
- Login page
- Product listing with pagination/search/filter/sort
- Product details + add to cart
- Product create/edit (admin only)
- Cart management
- Checkout flow
- Order summary page

### Global Notification System (Mandatory)

Implemented:
- Success, error, warning, info notifications
- Auto-dismiss behavior
- Manual close option
- Multiple stacked notifications
- Triggered by:
	- API success/error flows on frontend
	- Global HTTP error interceptor
	- Order completion
	- Authentication errors

Advanced:
- Real-time notifications via SignalR (`/hubs/notifications`)
- Notification center page with unread counter (`/orders/notifications`)

### Caching (added)

Implemented hybrid caching strategy:
- In-memory cache (`IMemoryCache`) for fast local reads
- Redis cache (`IDistributedCache`) for distributed/shared cache
- Cache invalidation on product changes and order completion

## 3. Prerequisites

- .NET SDK 8+
- Node.js 20+
- npm 10+
- Docker (for SQL Server + Redis)

## 4. Run Infrastructure (SQL Server + Redis)

From repository root:

```bash
docker compose up -d
```

This starts:
- SQL Server on `localhost:1433`
- Redis on `localhost:6379`

## 5. Run Backend

```bash
cd src/backend
dotnet restore ECommerceOrderManagement.slnx
dotnet run --project ECommerce.API
```

Backend defaults:
- API: `https://localhost:5001` (or local ASP.NET assigned port)
- Swagger: `/swagger`
- SignalR hub: `/hubs/notifications`

Default seeded users:
- Admin: `admin` / `Admin123!`
- Customer: `customer` / `Customer123!`

## 6. Run Frontend

```bash
cd src/frontend
npm install
npm start
```

Frontend default URL:
- `http://localhost:4200`

If your backend runs on different port, update:
- `src/frontend/src/environments/environment.ts`

## 7. Build Validation

Backend:

```bash
cd src/backend
dotnet build ECommerceOrderManagement.slnx -v minimal
```

Frontend:

```bash
cd src/frontend
npm run build
```

## 7.1 End-to-End Smoke Test

After starting infrastructure and backend, run:

```bash
./scripts/smoke-test.sh
```

Optional custom API base URL:

```bash
API_BASE_URL=https://localhost:5001 ./scripts/smoke-test.sh
```

This script verifies:
- Admin and customer authentication
- Product listing with paging/sort/filter query path
- Product details fetch
- Admin product creation and update
- Customer order creation with discount fields
- Authentication negative case (invalid credentials returns 401)

## 8. API Endpoints (Summary)

Auth:
- `POST /api/auth/login`

Products:
- `GET /api/products`
- `GET /api/products/{id}`
- `POST /api/products` (Admin)
- `PUT /api/products/{id}` (Admin)

Orders:
- `POST /api/orders`

## 9. Notes

- This assessment implementation is production-oriented in structure and security patterns.
- JWT secret and SQL credentials are currently demo values and must be changed for deployment.
- `EnsureCreated` is used for first-run DB bootstrap in this assessment setup.
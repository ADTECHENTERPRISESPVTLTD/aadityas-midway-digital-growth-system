# Aaditya's Midway - Full Stack Internship Task

This project implements the assignment FS-01 to FS-10:

- Backend server and API structure
- Environment variables
- Error handling and validation
- Authentication with JWT + bcrypt
- MongoDB database models
- Menu APIs
- Order APIs and order-status flow
- Booking APIs with date/time/guest validation
- Customer management
- Offers and coupons
- Admin APIs
- Reviews
- Analytics events
- Frontend-to-backend integration helper

## Requirements

- Node.js 18+
- MongoDB Atlas account or local MongoDB
- VS Code

## Setup

1. Open this folder in VS Code.
2. Open terminal.
3. Run:

```bash
npm install
```

4. Create `.env` from `.env.example`.
5. Put your MongoDB connection string in `MONGODB_URI`.
6. Change `JWT_SECRET`.
7. Set `CLIENT_URL` to your frontend URL.

Start:

```bash
npm run dev
```

The API will run at:

http://localhost:5000

Health check:

http://localhost:5000/api/health

Create admin:

```bash
npm run seed:admin
```

Load the menu (111 dishes) and the checkout coupons (MIDWEEK20, FIRSTBITE, GROUPDESSERT).
The website only accepts a coupon at checkout if it exists here. Safe to re-run:

```bash
npm run seed:menu
npm run seed:coupons
```

Admin login:

Email: admin@aadityasmidway.com
Password: Admin@123

Change this password for real deployment.

## Main API endpoints

### Auth
POST /api/auth/register
POST /api/auth/login

### Menu
GET /api/menu
GET /api/menu/:id
GET /api/menu/categories
POST /api/menu
PUT /api/menu/:id
DELETE /api/menu/:id

### Orders
POST /api/orders
GET /api/orders
GET /api/orders/:id
PATCH /api/orders/:id/status

Order flow:
Pending -> Confirmed -> Preparing -> Ready -> Completed

### Bookings
POST /api/bookings
GET /api/bookings
GET /api/bookings/:id
PATCH /api/bookings/:id

### Offers/Coupons
GET /api/offers
POST /api/offers
PUT /api/offers/:id
POST /api/offers/coupons
POST /api/offers/coupons/validate

### Customers
GET /api/customers
GET /api/customers/:id
POST /api/customers/:id/favourites/:itemId

### Reviews
GET /api/reviews
POST /api/reviews
PATCH /api/reviews/:id/approve

### Analytics
POST /api/analytics/events
GET /api/analytics/summary

### Admin dashboard
GET /api/admin/dashboard
GET /api/admin/menu
GET /api/admin/orders
GET /api/admin/bookings
GET /api/admin/customers
GET /api/admin/offers
GET /api/admin/reviews

## Frontend connection

Copy `frontend-integration/api.js` into your frontend.

For a React/Next/Vite frontend, use:

```js
import { apiRequest } from "./api";

const response = await apiRequest("/menu");
console.log(response.data);
```

For production, change API_BASE_URL to your deployed backend URL.

## MongoDB collections

Mongoose creates collections for:

users
customers
categories
menuitems
orders
bookings
offers
coupons
reviews
analyticsevents

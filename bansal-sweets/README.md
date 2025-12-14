# Bansal Sweets - E-Commerce Platform

A modern, full-stack e-commerce application for managing and selling Indian sweets online. Built with React, Node.js, Express, and MongoDB.

## Features

### Customer Features
- User authentication (Register/Login)
- Browse sweets catalog with search and filters
- Shopping cart management
- Order placement with delivery details
- Order history tracking
- Order cancellation (for pending orders)

### Admin Features
- Product management (Add/Edit/Delete)
- Inventory management and restocking
- Order management and status updates
- View all customer orders
- Real-time stock tracking

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- CORS enabled

### Frontend
- React 18
- Axios for API calls
- Modern CSS with gradients and animations
- Responsive design
- Dark theme UI

## Project Structure

```
bansal-sweets/
├── bansal-sweets-backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── scripts/
│   └── server.js
└── bansal-sweets-frontend/
    ├── public/
    └── src/
        ├── components/
        └── App.js
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd bansal-sweets/bansal-sweets-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create .env file:
```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/bansalsweets
JWT_SECRET=your-secret-key-here
```

4. Create super admin:
```bash
node scripts/createSuperAdmin.js
```

5. Start the server:
```bash
npm run dev
```

Backend will run on http://localhost:5001

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd bansal-sweets/bansal-sweets-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Frontend will run on http://localhost:3001

## Default Admin Credentials

```
Email: admin@bansalsweets.com
Password: admin123
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user

### Sweets
- GET /api/sweets - Get all sweets
- GET /api/sweets/search - Search sweets
- POST /api/sweets - Add sweet (Admin)
- PUT /api/sweets/:id - Update sweet (Admin)
- DELETE /api/sweets/:id - Delete sweet (Admin)
- POST /api/sweets/:id/restock - Restock sweet (Admin)

### Cart
- GET /api/cart - Get user cart
- POST /api/cart/add - Add item to cart
- PUT /api/cart/update/:itemId - Update cart item
- DELETE /api/cart/remove/:itemId - Remove from cart
- DELETE /api/cart/clear - Clear cart

### Orders
- POST /api/orders/place - Place order
- GET /api/orders/my-orders - Get user orders
- GET /api/orders/all - Get all orders (Admin)
- GET /api/orders/:id - Get order by ID
- PUT /api/orders/:id/status - Update order status (Admin)
- PUT /api/orders/:id/cancel - Cancel order

## Deployment

### Backend Deployment
1. Set environment variables on hosting platform
2. Ensure MongoDB connection string is correct
3. Deploy to platforms like Heroku, Railway, or Render

### Frontend Deployment
1. Build the production version:
```bash
npm run build
```
2. Deploy build folder to Netlify, Vercel, or similar platforms
3. Update API_URL in components to point to deployed backend

## Features Comparison with Original

This is a complete redesign with:
- Modern dark theme UI with gradient accents
- Sidebar navigation instead of top navigation
- Card-based layouts with hover effects
- Smooth animations and transitions
- Different component structure and naming
- Enhanced visual feedback
- Improved responsive design

## License

MIT License

## Support

For issues and questions, please create an issue in the repository.

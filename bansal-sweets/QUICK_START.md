# Quick Start Guide - Bansal Sweets

## Prerequisites
- Node.js installed
- MongoDB running (local or Atlas)

## Step 1: Install Backend Dependencies

```bash
cd bansal-sweets/bansal-sweets-backend
npm install
```

## Step 2: Configure Backend

Create a `.env` file in `bansal-sweets-backend/`:

```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/bansalsweets
JWT_SECRET=bansal-sweets-secret-key-2024
```

## Step 3: Create Admin Account

```bash
node scripts/createSuperAdmin.js
```

This creates:
- Email: admin@bansalsweets.com
- Password: admin123

## Step 4: Start Backend

```bash
npm run dev
```

Backend runs on: http://localhost:5001

## Step 5: Install Frontend Dependencies

Open a new terminal:

```bash
cd bansal-sweets/bansal-sweets-frontend
npm install
```

## Step 6: Start Frontend

```bash
npm start
```

Frontend runs on: http://localhost:3001

## Step 7: Access the Application

Open your browser and go to: http://localhost:3001

### Login as Admin
- Email: admin@bansalsweets.com
- Password: admin123

### Or Register as Customer
Click "Create Account" and register a new user account

## Key Features to Test

### As Admin:
1. Add new products in Management Panel
2. Update product inventory
3. View and manage all orders
4. Update order status

### As Customer:
1. Browse products
2. Search and filter sweets
3. Add items to shopping bag
4. Place orders
5. View order history

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify .env file exists with correct values
- Check if port 5001 is available

### Frontend won't start
- Check if backend is running first
- Verify port 3001 is available
- Clear npm cache: `npm cache clean --force`

### Can't login
- Ensure you created the admin account
- Check backend console for errors
- Verify MongoDB connection

## Project Structure

```
bansal-sweets/
├── bansal-sweets-backend/     (Port 5001)
│   ├── models/                (Database schemas)
│   ├── routes/                (API endpoints)
│   ├── middleware/            (Auth middleware)
│   └── scripts/               (Utility scripts)
└── bansal-sweets-frontend/    (Port 3001)
    └── src/
        ├── components/        (React components)
        └── App.js            (Main app)
```

## Next Steps

1. Add sample products through admin panel
2. Test customer flow: browse → cart → checkout
3. Test admin flow: manage products and orders
4. Customize branding and colors in CSS files

## Deployment Ready

This project is ready to deploy to:
- Backend: Heroku, Railway, Render
- Frontend: Netlify, Vercel, GitHub Pages
- Database: MongoDB Atlas

See README.md for detailed deployment instructions.

# Windows Setup Guide for Bansal Sweets

Follow these steps to run the Bansal Sweets project on Windows.

## Step 1: Install Backend Dependencies

Open PowerShell or Command Prompt and run:

```powershell
cd d:/bajaj/bansal-sweets/bansal-sweets-backend
npm install
```

Wait for installation to complete.

## Step 2: Create Environment File

Create a file named `.env` in the `bansal-sweets-backend` folder with this content:

```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/bansalsweets
JWT_SECRET=bansal-sweets-secret-key-2024
```

## Step 3: Ensure MongoDB is Running

Make sure MongoDB is installed and running on your system.

To check if MongoDB is running:
```powershell
mongod --version
```

If not installed, download from: https://www.mongodb.com/try/download/community

## Step 4: Create Admin Account

In the same terminal (bansal-sweets-backend folder):

```powershell
node scripts/createSuperAdmin.js
```

This creates an admin account:
- Email: admin@bansalsweets.com
- Password: admin123

## Step 5: Start Backend Server

```powershell
npm run dev
```

You should see:
- "Server running on port 5001"
- "MongoDB connected"

Keep this terminal open!

## Step 6: Install Frontend Dependencies

Open a NEW PowerShell/Command Prompt window:

```powershell
cd d:/bajaj/bansal-sweets/bansal-sweets-frontend
npm install
```

Wait for installation to complete.

## Step 7: Start Frontend Server

In the same terminal (bansal-sweets-frontend folder):

```powershell
npm start
```

The browser should automatically open at: http://localhost:3001

If not, manually open: http://localhost:3001

## Step 8: Login and Test

### Login as Admin:
- Email: admin@bansalsweets.com
- Password: admin123

### Or Create New Customer Account:
Click "Create Account" and register

## Troubleshooting

### Port Already in Use

If port 5001 or 3001 is already in use:

**Backend:** Edit `.env` file and change PORT to another number (e.g., 5002)

**Frontend:** In package.json, modify the start script:
```json
"start": "set PORT=3002 && react-scripts start"
```

### MongoDB Not Running

Start MongoDB service:
```powershell
net start MongoDB
```

Or if installed manually:
```powershell
mongod
```

### Cannot Find Module Errors

Clear cache and reinstall:
```powershell
npm cache clean --force
rmdir /s node_modules
npm install
```

## Quick Commands Reference

### Backend (Terminal 1):
```powershell
cd d:/bajaj/bansal-sweets/bansal-sweets-backend
npm run dev
```

### Frontend (Terminal 2):
```powershell
cd d:/bajaj/bansal-sweets/bansal-sweets-frontend
npm start
```

## What to Test

### As Admin:
1. Login with admin credentials
2. Go to Management Panel
3. Add a new product
4. Update inventory
5. View orders

### As Customer:
1. Register new account
2. Browse products
3. Add items to shopping bag
4. Place an order
5. View order history

## Stopping the Servers

Press `Ctrl + C` in each terminal window to stop the servers.

## Next Steps

Once both servers are running:
1. Test the application features
2. Add sample products as admin
3. Test customer purchase flow
4. Verify order management

## Need Help?

Check these files:
- README.md - Complete documentation
- QUICK_START.md - Quick setup guide
- DIFFERENCES.md - Comparison with original project
- PROJECT_SUMMARY.md - Project overview

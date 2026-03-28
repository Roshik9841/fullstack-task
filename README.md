# Buyer Portal

A simple real-estate buyer portal built with NestJS backend and React frontend.

## Features

- User registration and login with JWT authentication
- Buyer dashboard showing user info and favourites
- Add/remove properties to/from favourites
- Users can only access their own favourites

## How to Run

### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run start:dev
   ```

   The backend will run on http://localhost:3001

### Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

   The frontend will run on http://localhost:5173

## Example Flows

### Sign Up → Login → Add Favourite

1. Open the app in your browser (http://localhost:5173)
2. Click "Need an account? Register"
3. Fill in name, email, and password, then click "Register"
4. You'll see a success message, then switch to login
5. Enter your email and password, click "Sign in"
6. You'll be redirected to the dashboard
7. In the "Available Properties" section, click "Add to Favourites" on any property
8. The property will appear in "My Favourites"
9. You can remove it by clicking "Remove" in the favourites section or "Remove from Favourites" in the properties list

## API Endpoints

- `POST /user/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /properties` - Get all properties
- `GET /favourites` - Get user's favourites (requires JWT)
- `POST /favourites/:propertyId` - Add property to favourites (requires JWT)
- `DELETE /favourites/:propertyId` - Remove property from favourites (requires JWT)
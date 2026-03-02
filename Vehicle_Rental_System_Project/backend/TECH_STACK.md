# Backend Tech Stack & Structure

## Technologies Used

### Core Framework
- **Node.js** - JavaScript runtime
- **Express 4.18.2** - Web framework for APIs

### Database
- **MongoDB 7.1.0** - NoSQL database
- **Mongoose 7.5.0** - MongoDB ODM (Object Data Modeling)

### Authentication & Security
- **JWT (jsonwebtoken 9.0.2)** - Token-based authentication
- **bcryptjs 2.4.3** - Password hashing

### File Upload
- **Multer 2.1.0** - File upload middleware
- **Cloudinary** - Cloud image storage
- **multer-storage-cloudinary** - Cloudinary integration

### Other
- **CORS 2.8.5** - Cross-Origin Resource Sharing
- **dotenv 16.3.1** - Environment variables
- **nodemon 3.0.1** - Auto-restart (dev)

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── cloudinary.js      # Cloudinary config
│   │
│   ├── models/               # Database schemas
│   │   ├── User.js           # User model (user/owner/admin)
│   │   ├── Vehicle.js        # Vehicle model
│   │   ├── Booking.js        # Booking model
│   │   ├── Payment.js        # Payment model
│   │   └── Driver.js         # Driver model
│   │
│   ├── controllers/          # Business logic
│   │   ├── authController.js      # Login, Register, GetMe
│   │   ├── userController.js      # Profile management
│   │   ├── vehicleController.js   # Vehicle CRUD
│   │   ├── bookingController.js   # Booking management
│   │   ├── paymentController.js   # Payment processing
│   │   └── adminController.js     # Admin operations
│   │
│   ├── middleware/           # Custom middleware
│   │   ├── auth.js           # JWT verification
│   │   └── upload.js         # File upload (Cloudinary/Local)
│   │
│   ├── routes/              # API routes
│   │   ├── authRoutes.js    # /api/auth/*
│   │   ├── userRoutes.js    # /api/users/*
│   │   ├── vehicleRoutes.js # /api/vehicles/*
│   │   ├── bookingRoutes.js # /api/bookings/*
│   │   ├── paymentRoutes.js # /api/payments/*
│   │   ├── adminRoutes.js   # /api/admin/*
│   │   └── drivers.js       # /api/drivers/*
│   │
│   └── server.js            # Express app setup
│
├── .env                     # Environment variables
├── .env.example            # Environment template
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies
└── vercel.json             # Vercel deployment config

```

## Database Models

### User Model
```javascript
- name, email, password (hashed)
- role: user/owner/admin
- phone, address
- status: active/blocked
- isDeleted: boolean
```

### Vehicle Model
```javascript
- name, category, price, seats
- fuel, transmission, description
- images: [URLs]
- owner: User reference
- status: pending/verified/rejected
- availability: available/rented
- bookingCount: number
```

### Booking Model
```javascript
- vehicle, user, owner: references
- startDate, endDate, actualReturnDate
- location, totalAmount
- needDriver, driverCharges
- status: pending/approved/rejected/completed/cancelled
- paymentStatus: pending/paid/refunded
- latePenalty: number
```

### Payment Model
```javascript
- booking, user: references
- amount, method (cash/card/upi)
- status: pending/completed/failed
- transactionId: string
```

### Driver Model
```javascript
- name, phone, licenseNumber
- experience, rating
- availability: available/assigned
- owner: User reference
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /me` - Get current user

### Users (`/api/users`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update profile

### Vehicles (`/api/vehicles`)
- `GET /` - Get all verified vehicles
- `GET /:id` - Get vehicle details
- `POST /` - Create vehicle (owner)
- `PUT /:id` - Update vehicle (owner)
- `DELETE /:id` - Delete vehicle (owner)
- `GET /my-vehicles` - Get owner's vehicles
- `POST /upload` - Upload vehicle image

### Bookings (`/api/bookings`)
- `POST /` - Create booking
- `GET /my-bookings` - User's bookings
- `GET /owner-bookings` - Owner's bookings
- `GET /all` - All bookings (admin)
- `PUT /:id/status` - Update booking status

### Payments (`/api/payments`)
- `POST /` - Create payment
- `GET /my-payments` - User's payments
- `PUT /:id/status` - Update payment status

### Admin (`/api/admin`)
- `GET /dashboard` - Dashboard stats
- `GET /users` - All users
- `GET /owners` - All owners
- `PUT /users/:id/status` - Block/unblock user
- `PUT /owners/:id/status` - Block/unblock owner
- `PUT /vehicles/:id/verify` - Verify vehicle
- `GET /reports` - Analytics reports

### Drivers (`/api/drivers`)
- `GET /` - Get all drivers
- `POST /` - Add driver
- `PUT /:id` - Update driver
- `DELETE /:id` - Delete driver

## Middleware

### Authentication (auth.js)
- Verifies JWT token
- Attaches user to req.user
- Protects routes

### Role-based Access
- `protect` - Requires authentication
- `admin` - Requires admin role
- `owner` - Requires owner role

### File Upload (upload.js)
- Cloudinary (production) - Cloud storage
- Local storage (development) - uploads/ folder
- Auto-switches based on env variables
- File size limit: 5MB
- Allowed: jpg, jpeg, png, gif

## Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/vehicle_rental
JWT_SECRET=your_jwt_secret_key

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Key Features

### Authentication
- JWT token-based auth
- Password hashing with bcrypt
- Token expiry: 30 days
- Hardcoded admin login

### Authorization
- Role-based access (user/owner/admin)
- Route protection middleware
- Owner can only edit own vehicles

### File Upload
- Cloudinary for production
- Local storage for development
- Image optimization
- Secure file handling

### Booking System
- Date conflict checking
- Late return penalty calculation
- Booking extension support
- Status tracking

### Payment Processing
- Multiple payment methods
- Transaction ID generation
- Payment status tracking
- Refund support

### Admin Features
- User management
- Vehicle verification
- Booking oversight
- Revenue analytics

## Database Relationships

```
User (1) -----> (Many) Vehicles (owner)
User (1) -----> (Many) Bookings (user)
User (1) -----> (Many) Bookings (owner)
Vehicle (1) --> (Many) Bookings
Booking (1) --> (1) Payment
User (1) -----> (Many) Drivers (owner)
```

## Error Handling
- Try-catch blocks in all controllers
- Consistent error responses
- HTTP status codes
- Error messages in JSON

## Security
- Password hashing (bcrypt)
- JWT token authentication
- CORS enabled
- Environment variables for secrets
- Input validation

## Deployment
- Platform: Render
- Database: MongoDB Atlas
- Storage: Cloudinary
- Auto-deploy on Git push

## Development
```bash
npm install          # Install dependencies
npm start           # Start server (production)
npm run dev         # Start with nodemon (development)
```

## Production Considerations
- MongoDB Atlas for database
- Cloudinary for file storage
- Environment variables on Render
- CORS configured for frontend domain

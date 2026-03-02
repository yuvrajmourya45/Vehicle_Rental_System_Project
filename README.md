# Vehicle Rental System Project 🚗

A full-stack vehicle rental management system built with MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- **User Management**: Registration, login, and profile management
- **Vehicle Browsing**: View available vehicles with details
- **Booking System**: Book vehicles with date selection
- **Payment Integration**: Track payments and transaction history
- **Admin Dashboard**: Manage vehicles, bookings, and users
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Lucide React Icons
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup

```bash
cd Vehicle_Rental_System_Project/backend
npm install
cp .env.example .env
# Configure your .env file with MongoDB URI and JWT secret
npm start
```

### Frontend Setup

```bash
cd Vehicle_Rental_System_Project/frontend
npm install
cp .env.example .env
# Configure your .env file with backend API URL
npm start
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Project Structure

```
Vehicle_Rental_System_Project/
├── backend/          # Node.js backend
│   ├── src/         # Source files
│   └── package.json
├── frontend/        # React frontend
│   ├── src/        # Source files
│   └── package.json
└── README.md
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

## License

MIT

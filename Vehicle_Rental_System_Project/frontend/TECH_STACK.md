# Frontend Tech Stack & Structure

## Technologies Used

### Core Framework
- **React 19.2.4** - UI library for building components
- **React Router DOM 7.13.1** - Client-side routing

### Styling
- **Tailwind CSS 3.4.19** - Utility-first CSS framework
- **PostCSS 8.5.6** - CSS processing
- **Autoprefixer 10.4.27** - Auto CSS vendor prefixes

### HTTP & API
- **Axios 1.13.5** - HTTP client for API calls
- **API Base URL** - Configured via environment variable

### UI Components & Icons
- **Lucide React 0.575.0** - Icon library
- **Framer Motion 12.34.3** - Animation library

### Notifications
- **React Toastify 11.0.5** - Toast notifications

### Testing
- **@testing-library/react 16.3.2** - React testing utilities
- **@testing-library/jest-dom 6.9.1** - Jest DOM matchers
- **@testing-library/user-event 13.5.0** - User interaction simulation

## Project Structure

```
frontend/
├── public/                 # Static files
│   ├── index.html         # HTML template
│   ├── favicon.ico        # Site icon
│   └── manifest.json      # PWA manifest
│
├── src/
│   ├── components/        # Reusable components
│   │   ├── Navbar.jsx            # Navigation bar
│   │   ├── Footer.jsx            # Footer component
│   │   ├── AdminSidebar.jsx      # Admin sidebar
│   │   ├── OwnerSidebar.jsx      # Owner sidebar
│   │   └── UserSidebar.jsx       # User sidebar
│   │
│   ├── pages/            # Page components
│   │   ├── Common/              # Public pages
│   │   │   ├── landing.jsx      # Home page
│   │   │   ├── login.jsx        # Login page
│   │   │   ├── signup.jsx       # Registration
│   │   │   ├── vehicles.jsx     # Vehicle listing
│   │   │   ├── vehicleDetails.jsx # Vehicle details
│   │   │   ├── booking.jsx      # Booking form
│   │   │   ├── payment.jsx      # Payment page
│   │   │   ├── confirmation.jsx # Booking confirmation
│   │   │   ├── about.jsx        # About page
│   │   │   └── contact.jsx      # Contact page
│   │   │
│   │   ├── User/               # User dashboard
│   │   │   ├── UserHome.jsx    # User home
│   │   │   ├── BrowseVehicles.jsx # Browse vehicles
│   │   │   ├── MyBookings.jsx  # User bookings
│   │   │   ├── PaymentHistory.jsx # Payment history
│   │   │   └── UserProfile.jsx # User profile
│   │   │
│   │   ├── Owner/              # Owner dashboard
│   │   │   ├── Dashboard.jsx   # Owner dashboard
│   │   │   ├── AddVehicle.jsx  # Add vehicle form
│   │   │   ├── MyVehicles.jsx  # Vehicle management
│   │   │   ├── BookingRequests.jsx # Booking requests
│   │   │   ├── Drivers.jsx     # Driver management
│   │   │   ├── Earnings.jsx    # Earnings report
│   │   │   └── OwnerProfile.jsx # Owner profile
│   │   │
│   │   └── Admin/              # Admin dashboard
│   │       ├── Dashboard.jsx   # Admin dashboard
│   │       ├── ManageUsers.jsx # User management
│   │       ├── ManageOwners.jsx # Owner management
│   │       ├── ManageVehicles.jsx # Vehicle verification
│   │       ├── AllBookings.jsx # All bookings
│   │       ├── Reports.jsx     # Analytics & reports
│   │       └── Profile.jsx     # Admin profile
│   │
│   ├── services/         # API services
│   │   └── api.js       # Axios instance with interceptors
│   │
│   ├── CarRental-assets/ # Static assets
│   │   └── assets/      # Images, icons, SVGs
│   │
│   ├── App.js           # Main app component with routes
│   ├── App.css          # Global styles
│   ├── index.js         # React entry point
│   └── index.css        # Tailwind imports
│
├── .env                 # Environment variables
├── .gitignore          # Git ignore rules
├── package.json        # Dependencies
├── tailwind.config.js  # Tailwind configuration
├── postcss.config.js   # PostCSS configuration
└── vercel.json         # Vercel deployment config

```

## Key Features by Role

### Public (Common)
- Landing page with hero section
- Vehicle browsing with filters
- Vehicle details with booking
- User registration & login
- About & Contact pages

### User Dashboard
- Browse available vehicles
- Book vehicles with date selection
- View booking history
- Payment management
- Profile management

### Owner Dashboard
- Add new vehicles
- Manage vehicle listings
- View booking requests
- Approve/reject bookings
- Track earnings
- Driver management

### Admin Dashboard
- User management (block/unblock)
- Owner verification
- Vehicle verification
- View all bookings
- Analytics & reports
- System overview

## API Integration

### Authentication
- Login/Register with JWT tokens
- Token stored in localStorage
- Auto-redirect based on role

### Protected Routes
- Token sent in Authorization header
- Auto-logout on 401 errors
- Role-based access control

### File Uploads
- Vehicle images via multipart/form-data
- Cloudinary integration for storage

## Styling Approach

### Tailwind CSS
- Utility-first classes
- Responsive design (mobile-first)
- Custom color scheme (blue primary)
- Rounded corners (rounded-xl)
- Shadow effects for depth

### Responsive Design
- Mobile: Full width, stacked layout
- Tablet: 2-column grids
- Desktop: Sidebar + content layout

## State Management
- React useState for local state
- localStorage for auth persistence
- No external state library (Redux/Context)

## Routing
- React Router v7
- Role-based route protection
- Programmatic navigation
- URL parameters for details pages

## Environment Variables
```
REACT_APP_API_URL=https://your-backend-url.com/api
```

## Build & Deployment
- Build: `npm run build`
- Output: `build/` folder
- Deployed on: Vercel
- Auto-deploy on Git push

# Event Management Platform

A full-stack event management platform that enables users to create, manage, and participate in events with real-time updates.

## Features

### User Features
- ✨ User authentication with JWT
- 👤 User profiles with created and attended events
- 📝 Create, edit, and delete events
- 🎫 Join and leave events
- 🔍 Search and filter events by category, date, and status
- 📱 Responsive design for all devices

### Event Features
- 📸 Image upload support via Cloudinary
- 📍 Event details including location, date, time, and capacity
- 👥 Real-time attendee updates using Socket.IO
- 🏷️ Event categorization
- 🔒 Private/Public event options

### Technical Features
- ⚡ Real-time updates for event attendance
- 🔄 WebSocket integration for live data
- 🎨 Modern UI with Tailwind CSS
- 🛡️ Protected routes and API endpoints
- 🔍 Advanced event filtering and search

## Tech Stack

### Frontend
- React.js
- Redux Toolkit (State Management)
- Socket.IO Client
- Tailwind CSS
- React Router DOM
- Formik & Yup (Form Handling)
- Axios
- React Query

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JWT Authentication
- Cloudinary
- Express Validator

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Cloudinary account
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/event-management-platform.git
   ```

2. Frontend Setup:
   ```bash
   cd frontend
   npm install
   ```
   Create a `.env` file in the frontend directory:
   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000 
   ```

3. Backend Setup:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the backend directory:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   FRONTEND_URL=http://localhost:5173
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Event Endpoints
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get specific event
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/attend` - Attend event
- `DELETE /api/events/:id/attend` - Leave event

### User Endpoints
- `GET /api/users/:id/events` - Get user's created events
- `GET /api/users/:id/attending` - Get user's attending events
- `GET /api/users/:userId` - Get user profile

## Socket Events
- `joinEvent` - Join event room
- `leaveEvent` - Leave event room
- `eventUpdated` - Real-time event updates
- `attendeeUpdate` - Real-time attendee updates

## Testing

The application includes a Socket.IO test dashboard at `/backend/test-socket.html` for testing real-time functionality.

## Deployment

### Frontend Deployment
The frontend can be deployed on Vercel or Netlify:
1. Connect your GitHub repository
2. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
3. Add environment variables

### Backend Deployment
The backend can be deployed on Render or Railway.app:
1. Configure environment variables
2. Set up MongoDB Atlas connection
3. Configure Cloudinary credentials

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



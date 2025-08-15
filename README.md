# Car Rentals

## Description

Car Rentals is a modern, full-stack web application that provides a comprehensive platform for car rental services. The application enables users to browse and rent vehicles while allowing car owners to list and manage their fleet. Built with cutting-edge technologies, the platform offers a seamless experience for both renters and car owners with features like real-time booking, secure authentication, and intuitive dashboards.

The application serves as a marketplace connecting car owners with potential renters, providing a secure and user-friendly environment for vehicle rental transactions.

## Features

### For Renters
- **Car Browsing**: Browse through a comprehensive catalog of available cars with detailed information
- **Advanced Search & Filtering**: Filter cars by category, fuel type, transmission, seating capacity, and location
- **Car Details**: View detailed car specifications, images, pricing, and owner information
- **Secure Booking System**: Book cars with real-time availability checking
- **User Dashboard**: Manage personal bookings and view booking history
- **Google OAuth Integration**: Quick and secure login with Google accounts
- **Responsive Design**: Optimized experience across desktop, tablet, and mobile devices

### For Car Owners
- **Owner Dashboard**: Comprehensive management interface for car owners
- **Car Management**: Add, edit, and remove cars from the fleet
- **Booking Management**: View and manage incoming booking requests
- **Image Upload**: Upload high-quality car images with ImageKit integration
- **Analytics**: Track booking performance and revenue

### General Features
- **Secure Authentication**: JWT-based authentication with password encryption
- **Email Notifications**: Automated email notifications for bookings and updates
- **Password Reset**: Secure password reset functionality via email
- **Real-time Updates**: Dynamic content updates with smooth animations
- **Professional UI/UX**: Modern interface with Framer Motion animations

## Technologies Used

### Frontend
- **React 19.1.0** - Modern UI library for building user interfaces
- **Vite** - Fast build tool and development server
- **TailwindCSS 4.1.11** - Utility-first CSS framework for styling
- **Framer Motion 12.23.12** - Animation library for smooth transitions
- **React Router DOM 7.6.3** - Client-side routing
- **Axios 1.11.0** - HTTP client for API requests
- **React Hot Toast 2.5.2** - Elegant toast notifications
- **Google OAuth 0.12.2** - Google authentication integration

### Backend
- **Node.js** - JavaScript runtime environment
- **Express 5.1.0** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose 8.17.1** - MongoDB object modeling
- **JWT (jsonwebtoken 9.0.2)** - Secure token-based authentication
- **bcrypt 6.0.0** - Password hashing and encryption
- **Multer 2.0.2** - File upload middleware
- **ImageKit 6.0.0** - Image storage and optimization
- **Nodemailer 7.0.5** - Email sending functionality
- **Google Auth Library 10.2.1** - Google OAuth server-side verification

### Development Tools
- **ESLint** - Code linting and formatting
- **Nodemon** - Development server with auto-restart
- **Vercel** - Deployment and hosting platform

## Installation Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- MongoDB database (local or cloud)
- ImageKit account for image storage
- Google OAuth credentials (for authentication)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/OLUMZYXX/CarRentals.git
   cd CarRentals
   ```

2. **Navigate to server directory**
   ```bash
   cd server
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Environment Configuration**
   Create a `.env` file in the server directory with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   
   # ImageKit Configuration
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   
   # Email Configuration
   EMAIL_USER=your_email_address
   EMAIL_PASS=your_email_password
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

5. **Start the server**
   ```bash
   npm run server
   ```

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd ../client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the client directory:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173` (frontend) and `http://localhost:5000` (backend).

## Usage

### Live Demo
Experience the application live at: **https://car-rentals-blue.vercel.app**

### Getting Started

1. **User Registration/Login**
   - Visit the application homepage
   - Click on the "Login" button in the navigation
   - Sign up with email/password or use Google OAuth
   - Complete your profile information

2. **Browsing Cars**
   - Navigate to the "Cars" section
   - Use filters to find cars that match your preferences
   - Click on any car to view detailed information

3. **Booking a Car**
   - Select your desired car and click "Book Now"
   - Choose rental dates and confirm availability
   - Complete the booking process
   - View your booking in "My Bookings" section

4. **For Car Owners**
   - Access the owner dashboard at `/owner`
   - Add your cars with detailed information and images
   - Manage incoming booking requests
   - Track your rental performance

### Key Pages
- **Homepage**: Introduction and featured cars
- **Cars**: Complete car catalog with filtering
- **Car Details**: Detailed car information and booking
- **My Bookings**: User's rental history and active bookings
- **Owner Dashboard**: Car and booking management for owners

## Contributing

We welcome contributions to the Car Rentals project! Here's how you can contribute:

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Follow the installation instructions above
4. Make your changes

### Code Standards
- Follow existing code formatting and style
- Use ESLint for code linting
- Write clear, descriptive commit messages
- Add comments for complex logic
- Ensure responsive design for UI changes

### Submitting Changes
1. Test your changes thoroughly
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request with a detailed description of changes

### Areas for Contribution
- UI/UX improvements
- Additional car filters and search features
- Enhanced booking management
- Performance optimizations
- Mobile app development
- Testing coverage
- Documentation improvements

### Reporting Issues
- Use GitHub Issues to report bugs
- Provide detailed steps to reproduce issues
- Include browser/environment information
- Suggest potential solutions if possible

## License

This project is licensed under the ISC License. You are free to use, modify, and distribute this software for personal and commercial purposes.

---

**Built with ❤️ by the Car Rentals Team**

For questions or support, please open an issue on GitHub or contact the development team.
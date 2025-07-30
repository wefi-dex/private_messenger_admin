# Private Message Admin Panel

A modern, responsive admin panel for managing the Private Message application. Built with React, TypeScript, and Tailwind CSS.

## Features

### 🎯 Dashboard
- **Overview Statistics**: Total users, active reports, messages, and blocked users
- **Interactive Charts**: User growth trends and report type distribution
- **Recent Activity Feed**: Real-time updates on user actions
- **Performance Metrics**: Key indicators with trend analysis

### 👥 User Management
- **User List**: Complete user directory with search and filtering
- **User Details**: Detailed user profiles with activity history
- **User Actions**: Block/unblock users, view reports, manage status
- **Bulk Operations**: Mass user management capabilities

### 🚨 Report Management
- **Report Overview**: All user reports with status tracking
- **Report Details**: Complete report information with context
- **Status Management**: Resolve, dismiss, or escalate reports
- **Filtering & Search**: Find specific reports quickly

### 🔧 System Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Live data synchronization
- **Authentication**: Secure admin login system
- **Modern UI**: Clean, intuitive interface with dark/light themes

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **Routing**: React Router DOM
- **Icons**: Heroicons
- **Charts**: Recharts
- **HTTP Client**: Axios

## Prerequisites

- Node.js 16+ 
- npm or yarn
- Backend API running (see backend setup)

## Installation

1. **Clone the repository** (if not already done):
   ```bash
   cd admin
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   Create a `.env` file in the admin directory:
   ```env
   REACT_APP_API_URL=http://localhost:3000/api
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```

5. **Access the admin panel**:
   Open [http://localhost:3001](http://localhost:3001) in your browser

## Default Login Credentials

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change these credentials in production!

## API Integration

The admin panel connects to your backend API. Make sure your backend is running and the following endpoints are available:

### Required Endpoints

#### User Management
- `GET /api/users` - Get all users
- `GET /api/user/:id` - Get specific user
- `PUT /api/user/:id` - Update user
- `DELETE /api/user/:id` - Delete user
- `GET /api/user/:user_id/blocked` - Get blocked users
- `GET /api/user/:user_id/reports` - Get user reports

#### Report Management
- `GET /api/reports` - Get all reports
- `GET /api/report/:id` - Get specific report
- `PUT /api/report/:id` - Update report status
- `DELETE /api/report/:id` - Delete report

#### Block Management
- `POST /api/block` - Block user
- `POST /api/unblock` - Unblock user
- `GET /api/block-status` - Check block status

#### Analytics (Optional)
- `GET /api/analytics/dashboard` - Dashboard statistics
- `GET /api/analytics/users` - User analytics
- `GET /api/analytics/reports` - Report analytics

## Project Structure

```
admin/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── Layout.tsx          # Main layout with sidebar
│   ├── contexts/
│   │   └── AuthContext.tsx     # Authentication context
│   ├── pages/
│   │   ├── Dashboard.tsx       # Dashboard page
│   │   ├── Users.tsx          # User management
│   │   ├── Reports.tsx        # Report management
│   │   └── Login.tsx          # Login page
│   ├── services/
│   │   └── api.ts             # API service layer
│   ├── App.tsx                # Main app component
│   ├── index.tsx              # Entry point
│   └── index.css              # Global styles
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Adding New Features

1. **New Page**: Create component in `src/pages/`
2. **New API**: Add to `src/services/api.ts`
3. **New Route**: Add to `src/App.tsx` and `src/components/Layout.tsx`

### Styling

The project uses Tailwind CSS for styling. Custom styles can be added to `src/index.css` or by extending the Tailwind config.

## Production Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy the `build` folder** to your web server

3. **Configure environment variables** for production:
   ```env
   REACT_APP_API_URL=https://your-api-domain.com/api
   ```

4. **Set up authentication** for production use

## Security Considerations

- Change default admin credentials
- Implement proper authentication (JWT, OAuth, etc.)
- Use HTTPS in production
- Set up proper CORS policies
- Implement rate limiting
- Add input validation and sanitization

## Troubleshooting

### Common Issues

1. **API Connection Error**:
   - Check if backend is running
   - Verify API URL in `.env`
   - Check CORS settings

2. **Build Errors**:
   - Clear node_modules and reinstall
   - Check TypeScript errors
   - Verify all dependencies are installed

3. **Authentication Issues**:
   - Clear browser storage
   - Check token expiration
   - Verify login credentials

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the Private Message application. See the main project license for details.

## Support

For support and questions:
- Check the documentation
- Review the backend API documentation
- Open an issue in the repository
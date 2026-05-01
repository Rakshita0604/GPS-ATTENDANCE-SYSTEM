# GPS Attendance System - Complete Setup Guide

## Database Setup

1. **Run the SQL script to create database and tables:**
```bash
mysql -u root -p < backend/database.sql
```

2. **Update database credentials in `backend/config/db.js` if needed:**
```javascript
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "YOUR_PASSWORD",
  database: "geo_attendance"
});
```

## Backend Setup

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Create `uploads` directory for images:**
```bash
mkdir uploads
```

3. **Start the server:**
```bash
npm start
```
Server will run on `http://localhost:5000`

## Frontend Setup

1. **Install dependencies (including axios):**
```bash
cd frontend
npm install axios
npm install
```

2. **Start the development server:**
```bash
npm run dev
```
Frontend will run on `http://localhost:5173` (or shown in terminal)

## Features Implemented

### Backend
- ✅ User authentication with JWT
- ✅ Role-based access (Admin/Employee)
- ✅ Employee CRUD operations
- ✅ Attendance marking with image upload
- ✅ GPS location tracking
- ✅ Attendance history and reports
- ✅ Admin configuration for geofencing
- ✅ Proper error handling and validation

### Frontend
- ✅ User signup and login
- ✅ Role-based routing (Admin vs Employee)
- ✅ Employee dashboard with attendance stats
- ✅ Mark attendance with camera capture
- ✅ Geolocation integration
- ✅ Attendance history
- ✅ Employee management (Admin)
- ✅ Attendance reports (Admin)
- ✅ Geofencing configuration (Admin)
- ✅ Logout functionality
- ✅ Protected routes

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Attendance
- `POST /api/attendance/mark` - Mark attendance (check-in/check-out)
- `GET /api/attendance/history` - Get attendance history
- `GET /api/attendance/dashboard/:userId` - Get dashboard stats

### Employees (Admin only)
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get single employee
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Admin
- `GET /api/admin/config` - Get geofencing config
- `PUT /api/admin/config` - Update geofencing config
- `GET /api/admin/report` - Get attendance report
- `GET /api/admin/users` - Get all users

## Test Credentials

### Admin Account
- Email: `admin@test.com`
- Password: `Admin@123`
- Role: Admin

### Employee Account
- Email: `employee@test.com`
- Password: `Employee@123`
- Role: Employee

(Create these using the signup page, or insert directly into database)

## Troubleshooting

1. **"Cannot find module 'axios'"**
   - Run: `npm install axios` in frontend directory

2. **Database connection error**
   - Ensure MySQL is running
   - Check credentials in `backend/config/db.js`

3. **Port 5000 already in use**
   - Change port in `backend/server.js`
   - Update BASE_URL in `frontend/src/app/services/api.ts`

4. **CORS errors**
   - CORS is already enabled in backend
   - Ensure frontend is accessing `http://localhost:5000`

5. **Camera not working**
   - Allow browser camera permissions
   - Use HTTPS in production

## Project Structure

```
GPS-attendance-system/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── attendanceController.js
│   │   ├── employeeController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── upload.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── employeeRoutes.js
│   │   └── adminRoutes.js
│   ├── database.sql
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── Layout.tsx
│   │   │   │   └── UI.tsx
│   │   │   ├── pages/
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── Signup.tsx
│   │   │   │   ├── EmployeeDashboard.tsx
│   │   │   │   ├── MarkAttendance.tsx
│   │   │   │   ├── AttendanceHistory.tsx
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── EmployeeManagement.tsx
│   │   │   │   └── RecordsReports.tsx
│   │   │   ├── services/
│   │   │   │   ├── api.ts
│   │   │   │   ├── authService.ts
│   │   │   │   └── attendanceService.ts
│   │   │   └── utils/
│   │   │       └── cn.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── routes.tsx
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
└── README.md
```

## Security Notes

- JWT tokens expire in 24 hours
- Passwords are hashed with bcrypt
- Admin routes are protected with role-based middleware
- Images are stored in `/uploads` directory
- CORS is enabled for frontend origin

## Next Steps

1. Run database migrations
2. Install dependencies in both frontend and backend
3. Start backend server
4. Start frontend development server
5. Test signup and login
6. Create test data or use signup page to create accounts

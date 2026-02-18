npm # EduTrack Pro

A comprehensive educational management system built with modern web technologies.

## Tech Stack

- **Frontend**: React 18, TailwindCSS, React Router
- **Backend**: Node.js, Express
- **Database**: MySQL
- **API**: RESTful API with Express

## Project Structure

```
EduTrackPro/
├── client/                 # React frontend application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable components
│   │   ├── App.jsx       # Main App component
│   │   └── index.jsx     # Entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
├── server/                # Node.js/Express backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── routes/          # API routes
│   ├── models/          # Database models
│   ├── server.js        # Server entry point
│   ├── package.json
│   └── .env            # Environment variables
├── .github/
│   └── copilot-instructions.md
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project**
   ```bash
   cd EduTrackPro
   ```

2. **Set up the Backend**
   ```bash
   cd server
   npm install
   ```

   Configure your MySQL connection in `.env`:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=edutrack_pro
   ```

3. **Set up the Frontend**
   ```bash
   cd ../client
   npm install
   ```

4. **Create the Database**
   
   Log in to MySQL and run:
   ```sql
   CREATE DATABASE IF NOT EXISTS edutrack_pro;
   USE edutrack_pro;

   CREATE TABLE students (
     id INT PRIMARY KEY AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
     email VARCHAR(100),
     roll_number VARCHAR(50),
     class VARCHAR(50),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE teachers (
     id INT PRIMARY KEY AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
     email VARCHAR(100),
     subject VARCHAR(100),
     department VARCHAR(100),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE student_performance (
     id INT PRIMARY KEY AUTO_INCREMENT,
     student_id INT,
     performance_score INT,
     academic_year INT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (student_id) REFERENCES students(id)
   );

   CREATE TABLE alerts (
     id INT PRIMARY KEY AUTO_INCREMENT,
     title VARCHAR(255),
     description TEXT,
     status VARCHAR(50),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

## Running the Application

### Start the Backend Server
```bash
cd server
npm start        # Production mode
npm run dev      # Development mode with nodemon
```

The server will run on `http://localhost:5000`

### Start the Frontend Development Server
```bash
cd client
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student

### Teachers
- `GET /api/teachers` - Get all teachers
- `GET /api/teachers/:id` - Get teacher by ID
- `POST /api/teachers` - Create new teacher

## Features

- **Dashboard Overview**: Real-time statistics and performance tracking
- **Student Management**: Add, view, and manage student information
- **Teacher Management**: Manage teacher profiles and assignments
- **Performance Tracking**: Monitor student academic performance
- **Alert System**: Track and manage system alerts

## Development

### Available Scripts

**Client:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

**Server:**
- `npm start` - Start server
- `npm run dev` - Start with auto-reload

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for any purpose.

## Support

For support, email support@edutrack.pro or create an issue in the repository.

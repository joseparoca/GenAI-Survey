# GenAI Adoption Survey Platform

A comprehensive web application designed to streamline GenAI adoption surveys across organizations, providing intelligent and user-friendly workflows for data collection and organizational insights.

## Features

- 📊 **Dynamic Survey System** - Interactive survey interfaces with real-time progress tracking
- 🔐 **Secure Access Management** - Anonymous codes and continuation codes for privacy
- 📈 **Company Dashboard** - Advanced analytics and employee access code sharing
- ⏱️ **Time Allocation Tracking** - Detailed work category tracking and analysis
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- **React.js** - Interactive user interfaces
- **Tailwind CSS** - Responsive styling
- **Tanstack Query** - Real-time data fetching
- **React Hook Form** - Form management
- **shadcn/ui** - Modern UI components

### Backend
- **Express.js** - Server framework
- **PostgreSQL** - Database
- **Drizzle ORM** - Type-safe database management
- **Passport.js** - Authentication
- **Zod** - Schema validation

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd [repository-name]
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```env
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_session_secret
NODE_ENV=development
```

4. Run database migrations:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Application pages
│   │   └── lib/         # Utilities and helpers
├── server/              # Express backend
│   ├── routes.ts        # API endpoints
│   ├── storage.ts       # Database interface
│   └── index.ts         # Server configuration
├── shared/              # Shared types and schemas
│   └── schema.ts        # Database schema definitions
└── dist/                # Production build (gitignored)
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio for database management

## Key Features

### Survey Management
- Dynamic question flow based on user responses
- Progress saving with continuation codes
- Anonymous response submission
- Real-time validation

### Company Dashboard
- Employee response tracking
- Access code generation and management
- Data export capabilities
- Analytics and insights

### Security
- Secure session management
- Password hashing with bcrypt
- Environment-based configuration
- CSRF protection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support, please contact the development team.

---

Built with ❤️ using modern web technologies
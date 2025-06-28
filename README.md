# Abathwa Capital Investment Portal

A comprehensive investment platform connecting African entrepreneurs with investors, featuring AI-powered risk assessment, reliability scoring, and advanced portfolio management.

## 🚀 Features

### Core Platform
- **Multi-role Authentication**: Entrepreneurs, Investors, Service Providers, Observers, and Super Admins
- **Investment Opportunities**: Create, manage, and discover investment opportunities
- **Investment Pools**: Syndicate investments and manage collective funding
- **Document Management**: Secure file uploads and document sharing
- **Real-time Notifications**: Live updates and communication

### AI/ML Integration
- **Reliability Scoring**: AI-powered entrepreneur reliability assessment
- **Risk Assessment**: Machine learning-based investment opportunity risk analysis
- **Performance Analytics**: Leader performance evaluation and insights
- **Predictive Analytics**: Investment success prediction models

### Advanced Features
- **Escrow Management**: Secure payment handling and fund management
- **Observer System**: Transparent oversight and reporting
- **Milestone Tracking**: Progress monitoring and milestone management
- **Audit Logging**: Comprehensive activity tracking and compliance
- **Multi-language Support**: English and local language support

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **React Router** for navigation
- **React Hook Form** for form management

### Backend
- **Node.js** with TypeScript
- **Express.js** for API framework
- **Supabase** for database and authentication
- **TensorFlow.js** for AI/ML features
- **JWT** for authentication
- **Joi** for validation

### Database
- **PostgreSQL** (via Supabase)
- **Row Level Security (RLS)**
- **Real-time subscriptions**
- **File storage**

### AI/ML
- **TensorFlow.js** for client-side ML
- **Custom scoring algorithms**
- **Risk assessment models**
- **Performance analytics**

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/abathwa-investment-hub.git
cd abathwa-investment-hub
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment example file and configure your variables:

```bash
cp env.example .env.local
```

Update the following required variables in `.env.local`:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_ANON_KEY=your_supabase_anon_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure

# Admin Configuration
ADMIN_KEY=your_admin_key_for_super_admin_registration

# API Configuration
VITE_API_URL=http://localhost:3001/api
CORS_ORIGIN=http://localhost:5173
```

### 4. Database Setup

1. Create a new Supabase project
2. Run the database schema from `database_schema.sql` in your Supabase SQL editor
3. Configure RLS policies and storage buckets

### 5. Start Development Servers

#### Option A: Full Stack Development (Recommended)
```bash
npm run dev:full
```

#### Option B: Separate Frontend and Backend
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run dev:server
```

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/health

## 📁 Project Structure

```
abathwa-investment-hub/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Shadcn/ui components
│   │   └── ...             # Custom components
│   ├── hooks/              # React hooks
│   ├── lib/                # Utilities and API client
│   ├── pages/              # Page components
│   ├── server/             # Backend API
│   │   ├── api/            # API routes
│   │   ├── middleware/     # Express middleware
│   │   ├── services/       # Business logic
│   │   └── utils/          # Server utilities
│   ├── shared/             # Shared types
│   └── integrations/       # Third-party integrations
├── supabase/               # Supabase configuration
├── public/                 # Static assets
└── dist/                   # Build output
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh JWT token

### Users
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin)

### Opportunities
- `GET /api/opportunities` - Get published opportunities
- `POST /api/opportunities` - Create opportunity
- `GET /api/opportunities/:id` - Get opportunity by ID
- `PUT /api/opportunities/:id` - Update opportunity
- `DELETE /api/opportunities/:id` - Delete opportunity
- `POST /api/opportunities/:id/publish` - Publish opportunity
- `POST /api/opportunities/:id/approve` - Approve opportunity (admin)
- `POST /api/opportunities/:id/reject` - Reject opportunity (admin)

### AI/ML
- `POST /api/ai/reliability-score/:userId` - Calculate reliability score
- `POST /api/ai/risk-assessment/:opportunityId` - Assess opportunity risk
- `POST /api/ai/leader-performance` - Calculate leader performance
- `GET /api/ai/model-status` - Get AI model status

## 🔐 Authentication & Authorization

### User Roles
- **super_admin**: Full platform access
- **entrepreneur**: Create and manage opportunities
- **investor**: Browse and invest in opportunities
- **service_provider**: Provide services to entrepreneurs
- **observer**: Monitor and report on activities

### JWT Token Flow
1. User registers/logs in
2. Server validates credentials with Supabase
3. JWT token generated and returned
4. Token included in Authorization header for API requests
5. Server validates token and extracts user info

## 🤖 AI/ML Features

### Reliability Scoring
- Analyzes entrepreneur performance history
- Considers milestone completion rates
- Evaluates communication responsiveness
- Calculates agreement compliance scores

### Risk Assessment
- Financial risk analysis
- Market risk evaluation
- Team risk assessment
- Entrepreneur reliability factor

### Performance Analytics
- Leader performance tracking
- Meeting and announcement metrics
- Investment success rates
- Member satisfaction scores

## 🗄 Database Schema

The application uses a comprehensive PostgreSQL schema with:

- **Users & Profiles**: User management and profiles
- **Opportunities**: Investment opportunity details
- **Investment Pools**: Collective investment management
- **Transactions**: Financial transaction tracking
- **Documents**: File management and sharing
- **Agreements**: Legal document management
- **Observers**: Oversight and reporting system
- **Audit Logs**: Activity tracking and compliance

## 🚀 Deployment

### Development
```bash
npm run dev:full
```

### Production Build
```bash
# Build frontend
npm run build

# Build backend
npm run build:server

# Start production server
npm start
```

### Environment Variables
Ensure all production environment variables are set:
- Database credentials
- JWT secrets
- API keys
- CORS origins
- AI model URLs

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: support@abathwa.com
- Documentation: [docs.abathwa.com](https://docs.abathwa.com)
- Issues: [GitHub Issues](https://github.com/your-username/abathwa-investment-hub/issues)

## 🔄 Version History

- **v1.0.0** - Initial release with core features
- **v1.1.0** - AI/ML integration
- **v1.2.0** - Advanced analytics and reporting
- **v1.3.0** - Multi-language support

## 🙏 Acknowledgments

- Supabase for the excellent backend-as-a-service
- Shadcn/ui for the beautiful component library
- TensorFlow.js for ML capabilities
- The React and TypeScript communities

---

**Built with ❤️ for African entrepreneurs and investors**

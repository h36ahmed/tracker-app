# Lazer Projects - Client Health Dashboard

A modern web application that tracks client project health by monitoring developer updates from Slack channels. Built with Next.js, TypeScript, Tailwind CSS, and Prisma with advanced scoring and health analytics.

## Features

- **Real-time Project Monitoring**: Track project health status (Green/Yellow/Red) based on update frequency, content analysis, and scoring
- **Advanced Health Analytics**: Project health considers client scores (1-5), project scores (1-5), update frequency, and sentiment analysis
- **Slack Integration**: Receive weekly developer updates with scoring via webhook endpoint
- **Project Management**: Add, view, and manage projects with a modern modal interface
- **Score Tracking**: Monitor client and project scores over time with historical data
- **Modern UI**: Clean, responsive dashboard built with Radix UI components and Tailwind CSS
- **Admin Dashboard**: Complete project management with statistics and recent updates
- **Toast Notifications**: Real-time feedback for all user actions

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **UI Components**: Radix UI primitives with custom components
- **Forms**: Server Actions with useFormState for modern form handling
- **Database**: PostgreSQL with Prisma ORM
- **Integration**: Slack webhook endpoint for weekly updates with scoring support
- **Notifications**: Radix UI Toast system
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or cloud)
- Slack workspace (for integration)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tracker-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your database and Slack credentials:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/client_health_dashboard"
SERVER_API_KEY=
```

4. Set up the database:
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the dashboard.

## Health Status Logic

Projects are automatically assigned health status based on multiple factors:

### Scoring Priority (Highest Priority)
- **🔴 Red**: Client score ≤ 2 OR Project score ≤ 2
- **🟡 Yellow**: Client score = 3 OR Project score = 3
- **🟢 Green**: Client score ≥ 4 AND Project score ≥ 4

### Content Analysis
- **🔴 Red**: Updates containing keywords like "blocker", "delay", "issue", "problem", "stuck", "blocked"

### Time-based Status (Fallback)
- **🟢 Green**: Updated within last 5 days
- **🟡 Yellow**: Updated 6-10 days ago
- **🔴 Red**: No update in >10 days

### Score Display
- Client scores and project scores (1-5 scale) are displayed in:
  - Recent updates section
  - Project health dashboard
  - Individual project pages

### Channel Mapping

Add projects through the admin interface or map Slack channels to projects in the database:

**Via Admin UI (Recommended):**
1. Go to `/admin`
2. Click "Add Project"
3. Fill out the form with project details
4. Submit to create the project

**Via Database:**
```sql
INSERT INTO projects (name, slack_channel_id, vertical, description)
VALUES ('My Project', 'C1234567890', 'APP', 'Mobile app development project');
```

### Weekly Update Format

The `/api/weekly-updates` endpoint expects JSON data with the following structure:
```json
{
  "user_id": "U1234567890",
  "user_name": "John Doe",
  "channel_id": "C1234567890",
  "weekly_updates": "Completed user authentication feature. Fixed API rate limiting issues.",
  "project_score": "4",
  "client_score": "5",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   └── weekly-updates/ # Weekly update webhook endpoint
│   ├── projects/[id]/     # Project detail pages
│   ├── admin/             # Admin dashboard
│   └── page.tsx           # Main dashboard
├── components/            # Reusable UI components
│   ├── ui/               # Radix UI components
│   ├── add-project-form.tsx    # Project creation form
│   ├── add-project-dialog.tsx  # Modal wrapper
│   └── projects-list.tsx       # Project listing
├── lib/                  # Utilities and configurations
│   ├── actions/          # Server actions
│   │   └── projects.ts   # Project CRUD operations
│   ├── prisma.ts         # Database client
│   ├── utils.ts          # Helper functions
│   └── seed.ts           # Database seeding
├── hooks/                # Custom React hooks
│   └── use-toast.ts      # Toast notification hook
├── types/                # TypeScript type definitions
└── scripts/              # Utility scripts
```

## Database Schema

- **Projects**: Store project information, Slack channel mapping, vertical classification, and descriptions
- **Updates**: Developer updates from Slack with timestamps, client scores (1-5), and project scores (1-5)
- **Users**: Slack user information including names and avatars

### Key Fields
- **Projects**: `id`, `name`, `slackChannelId`, `vertical` (CRYPTO/APP/COMMERCE), `description`
- **Updates**: `id`, `projectId`, `userId`, `text`, `clientScore`, `projectScore`, `createdAt`
- **Users**: `id`, `slackUserId`, `name`, `email`, `avatar`

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Database Setup

I used Prisma DB hosting (postgres)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes
- `npm run db:migrate` - Run migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with sample data

### Code Quality

This project follows strict TypeScript and code quality standards:
- ESLint for code linting
- TypeScript strict mode enabled
- Clean code principles following established cursor rules
- Server-first architecture with Server Actions
- Proper error handling and validation
- Accessible UI components with Radix UI
- Mobile-first responsive design

## Key Features Walkthrough

### Dashboard (`/`)
- **Project Statistics**: Real-time counts of total, healthy, and at-risk projects
- **Projects Overview**: Grid view of all projects with health status badges
- **Health Indicators**: Visual status with emojis for each vertical (₿ Crypto, 📱 App, 🛒 Commerce)

### Admin Dashboard (`/admin`)
- **Add Project**: Modal form with validation for creating new projects
- **Project Statistics**: Comprehensive stats including projects by vertical
- **Recent Updates**: Timeline of latest developer updates across all projects
- **Toast Notifications**: Real-time feedback for all actions

### Project Details (`/projects/[id]`)
- **Project Information**: Complete project details with health status
- **Recent Updates**: Chronological list of updates with scores displayed
- **Health Metrics**: Last update time, days since update, and latest scores
- **Score History**: Client and project scores from recent updates

### Add Project Flow
1. Click "Add Project" in admin dashboard
2. Fill required fields: Name, Slack Channel ID, Vertical
3. Optional: Add project description
4. Server-side validation ensures unique Slack Channel IDs
5. Success/error feedback via toast notifications
6. Automatic page refresh shows new project

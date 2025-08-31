# Client Health Dashboard

A modern web application that tracks client project health by monitoring developer updates from Slack channels. Built with Next.js, TypeScript, Tailwind CSS, and Prisma.

## Features

- **Real-time Project Monitoring**: Track project health status (Green/Yellow/Red) based on update frequency and content
- **Slack Integration**: Automatically capture developer updates from Slack channels
- **Modern UI**: Clean, responsive dashboard built with ShadCN UI components
- **Project Management**: View detailed project information and update history
- **Admin Dashboard**: Manage projects and monitor system health

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: ShadCN UI (Radix UI primitives)
- **Database**: PostgreSQL with Prisma ORM
- **Integration**: Slack Events API
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
SLACK_BOT_TOKEN="xoxb-your-bot-token"
SLACK_SIGNING_SECRET="your-signing-secret"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
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

Projects are automatically assigned health status based on:

- **🟢 Green**: Updated within last 2 days
- **🟡 Yellow**: Updated 3-5 days ago
- **🔴 Red**: No update in >5 days OR contains keywords like "blocker", "delay", "issue"

## Slack Integration

### Setting up Slack App

1. Create a new Slack app at [api.slack.com](https://api.slack.com/apps)
2. Enable Event Subscriptions and set Request URL to: `https://your-domain.com/api/slack/events`
3. Subscribe to `message.channels` bot event
4. Install app to your workspace
5. Add bot to project channels

### Channel Mapping

Map Slack channels to projects in the database:
```sql
INSERT INTO projects (name, slack_channel_id, vertical)
VALUES ('My Project', 'C1234567890', 'APP');
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/slack/         # Slack webhook endpoints
│   ├── projects/[id]/     # Project detail pages
│   └── admin/             # Admin dashboard
├── components/            # Reusable UI components
│   └── ui/               # ShadCN UI components
├── lib/                  # Utilities and configurations
│   ├── prisma.ts         # Database client
│   ├── utils.ts          # Helper functions
│   └── seed.ts           # Database seeding
├── types/                # TypeScript type definitions
└── scripts/              # Utility scripts
```

## Database Schema

- **Projects**: Store project information and Slack channel mapping
- **Updates**: Developer updates from Slack with timestamps
- **Users**: Slack user information

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Database Setup

For production, use a managed PostgreSQL service like:
- Supabase (recommended)
- Neon
- PlanetScale
- Railway

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
- Prettier for code formatting
- TypeScript strict mode enabled
- Clean code principles

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

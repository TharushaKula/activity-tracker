# Daily Activity Tracker

A beautiful, full-featured daily activity tracking web application built with Next.js, Firebase, and Clerk authentication.

## Features

### Core Features
- ✅ **User Authentication** - Secure authentication with Clerk (Email/Password + OAuth)
- ✅ **Activity Logging** - Log activities with title, description, time, mood, and tags
- ✅ **CRUD Operations** - Full create, read, update, and delete functionality
- ✅ **Multiple Views** - Daily, Weekly, and Monthly activity views
- ✅ **Search & Filter** - Search activities by keywords, filter by mood and tags
- ✅ **Analytics Dashboard** - Weekly productivity charts and statistics
- ✅ **Streak Tracking** - Track your daily activity streaks with badges
- ✅ **Smart Reminders** - Evening reminders to log your activities
- ✅ **Responsive Design** - Beautiful UI that works on mobile, tablet, and desktop

### UI/UX Features
- 🎨 Modern, premium design with Tailwind CSS
- 🎭 Smooth animations with Framer Motion
- 📊 Interactive charts with Recharts
- 🌙 Dark mode support
- 🎯 Intuitive navigation and user experience

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Authentication**: Clerk
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + Custom components
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase project with Firestore enabled
- Clerk account and application

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd predict-future
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   # Clerk Configuration
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
   ```

4. **Set up Firebase**

   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Copy your Firebase configuration values to `.env.local`

5. **Set up Clerk**

   - Create a Clerk account at [Clerk](https://clerk.com/)
   - Create a new application
   - Configure OAuth providers (optional)
   - Copy your Clerk keys to `.env.local`

6. **Run the development server**

   ```bash
   npm run dev
   ```

7. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── api/
│   │   └── activities/          # API routes for CRUD operations
│   ├── dashboard/               # Dashboard pages
│   │   ├── daily/              # Daily view
│   │   ├── weekly/             # Weekly view
│   │   ├── monthly/            # Monthly view
│   │   └── search/              # Search & filter page
│   ├── sign-in/                # Sign in page
│   ├── sign-up/                # Sign up page
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/
│   ├── activities/             # Activity-related components
│   ├── charts/                 # Chart components
│   ├── dashboard/              # Dashboard components
│   ├── ui/                     # Reusable UI components
│   └── views/                  # View components
├── lib/
│   ├── firebase/               # Firebase configuration and utilities
│   └── utils.ts                # Utility functions
├── middleware.ts               # Clerk middleware
└── package.json
```

## Firebase Data Structure

Activities are stored in Firestore with the following structure:

```
users/
  {userId}/
    activities/
      {activityId}/
        title: string
        description: string
        time: Timestamp
        mood: "happy" | "neutral" | "sad" | "excited" | "tired" | "anxious"
        tags: string[]
        createdAt: Timestamp
        updatedAt: Timestamp
```

## Features in Detail

### Activity Management
- **Create**: Add new activities with title, description, time, mood, and tags
- **Read**: View activities in daily, weekly, or monthly formats
- **Update**: Edit existing activities
- **Delete**: Remove activities with confirmation

### Views

#### Daily View
- View activities for a specific day
- Navigate between days
- Quick add activity button
- Timeline of activities

#### Weekly View
- Bar chart showing activities per day
- Week overview with all activities
- Navigate between weeks

#### Monthly View
- Calendar view with activity counts
- Monthly statistics
- Navigate between months

### Search & Filter
- Search by title, description, or tags
- Filter by mood
- Filter by tags
- Real-time filtering

### Analytics
- Today's activity count
- Weekly activity count
- Total activities
- Mood distribution
- Weekly productivity charts

### Streak Tracking
- Calculate daily streaks
- Badge system (7-day, 30-day, 100-day)
- Visual streak indicators

### Smart Reminders
- Evening reminders (after 6 PM)
- Dismissible notifications
- Local storage for dismissal state

## API Routes

### GET `/api/activities`
Get all activities with optional filters:
- `startDate`: Filter by start date
- `endDate`: Filter by end date
- `mood`: Filter by mood
- `tags`: Filter by tags (comma-separated)

### POST `/api/activities`
Create a new activity:
```json
{
  "title": "Activity title",
  "description": "Activity description",
  "time": "2024-01-01T10:00:00Z",
  "mood": "happy",
  "tags": ["work", "meeting"]
}
```

### GET `/api/activities/[id]`
Get a specific activity by ID

### PATCH `/api/activities/[id]`
Update an activity:
```json
{
  "title": "Updated title",
  "mood": "excited"
}
```

### DELETE `/api/activities/[id]`
Delete an activity

## Development

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Security

- All routes are protected with Clerk authentication
- User data is isolated by userId in Firestore
- API routes verify authentication before processing requests
- Environment variables are used for sensitive configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js, Firebase, and Clerk

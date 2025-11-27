# Setup Guide

## Quick Start

1. **Create `.env.local` file** in the root directory with your configuration:

```env
# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Y2F1c2FsLXJhcHRvci00Ny5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_Ywbfrx5okTH9pU2drLOf5uzfxGM9SEK585jvPmBw5y
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDy0XdG9OXgpgb8CYH60jKhY-THTt4vha8
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=predict-future-43f15.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=predict-future-43f15
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=predict-future-43f15.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=945140786840
NEXT_PUBLIC_FIREBASE_APP_ID=1:945140786840:web:d316cba808c55a9645d2ed
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-VXD5FQYX0X
```

2. **Install dependencies** (if not already done):
```bash
npm install --legacy-peer-deps
```

3. **Start the development server**:
```bash
npm run dev
```

4. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `predict-future-43f15`
3. Enable Firestore Database:
   - Go to Firestore Database
   - Click "Create database"
   - Start in test mode (for development)
   - Choose a location

## Clerk Setup

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Your application should already be configured
3. Ensure OAuth providers are set up if you want social login

## Features Checklist

✅ Authentication (Clerk)
✅ Activity CRUD Operations
✅ Daily/Weekly/Monthly Views
✅ Search & Filter
✅ Analytics Dashboard
✅ Streak Tracking
✅ Smart Reminders
✅ Responsive Design
✅ Dark Mode Support

## Troubleshooting

### Dependencies Issues
If you encounter peer dependency conflicts, use:
```bash
npm install --legacy-peer-deps
```

### Firebase Connection Issues
- Verify your Firebase project ID matches the one in `.env.local`
- Check that Firestore is enabled in your Firebase project
- Ensure your Firebase project has the correct permissions

### Clerk Authentication Issues
- Verify your Clerk keys are correct
- Check that the sign-in/sign-up URLs match your configuration
- Ensure Clerk middleware is properly configured

### Build Issues
If you encounter build errors:
```bash
npm run build
```

Check the error messages and ensure all environment variables are set correctly.


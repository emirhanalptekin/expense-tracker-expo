# Expense Tracker Mobile Application

## Project Overview

A mobile application developed using React Native and Firebase for personal finance management. The application allows users to track income and expenses with real-time data synchronization.

## Technologies Used

- React Native with Expo SDK
- Firebase Authentication
- Firebase Firestore Database
- TypeScript
- Expo Router for navigation
- React Context API for state management

## Features

### User Authentication
- Email/password registration and login
- Session persistence using AsyncStorage
- Protected routes with authentication guards

### Transaction Management
- Add income and expense transactions
- Categorize transactions
- Delete transactions with long press
- Date selection for transactions
- Optional notes field

### Data Visualization
- Dashboard with total balance display
- Income and expense summary
- Recent transactions list
- Weekly bar chart statistics
- Category-based expense analysis

### Real-time Synchronization
- Live updates across all screens
- Immediate balance calculations
- Multi-device support

## Project Structure

```
expense-tracker-expo/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx
│   │   ├── explore.tsx
│   │   ├── transactions.tsx
│   │   └── profile.tsx
│   ├── _layout.tsx
│   ├── login.tsx
│   └── add-transaction.tsx
├── src/
│   ├── config/
│   ├── context/
│   ├── services/
│   └── components/
└── assets/
```

## Database Schema

### Users Collection
- userId: string
- email: string
- displayName: string
- balance: number
- totalIncome: number
- totalExpenses: number
- totalTransactions: number

### Transactions Collection
- id: string
- userId: string
- title: string
- amount: number
- type: 'income' | 'expense'
- category: string
- date: string
- notes: string (optional)
- createdAt: timestamp

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure Firebase credentials in `src/config/firebase.ts`
4. Run the application: `npx expo start`

## Building APK

To generate an APK file:
```bash
eas build -p android --profile preview
```

## Known Limitations

- No budget planning module
- No data export functionality
- No multi-currency support
- No dark mode theme
- No receipt photo attachments

## Security Considerations

- Firebase Security Rules implemented for user data isolation
- Input validation on all forms
- Authentication required for all protected routes

## Performance Notes

- Uses React Native FlatList for optimized list rendering
- Implements real-time listeners for live data updates
- Minimal re-renders through proper state management

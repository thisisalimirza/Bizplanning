# CAGR Calculator App

A simple React Native app built with Expo that helps entrepreneurs with financial planning by converting monthly growth rates to CAGR (Compound Annual Growth Rate) and showing month-over-month revenue projections.

## Features

- **Monthly Growth to CAGR Conversion**: Enter a monthly growth rate and see the equivalent annual CAGR
- **Revenue Projections**: View month-by-month revenue projections for 12 months
- **Real-time Calculations**: All calculations update instantly as you change inputs
- **Mobile-Friendly**: Works on both iOS and Android devices
- **Clean UI**: Professional, easy-to-read interface designed for entrepreneurs

## How It Works

The app calculates:
1. **CAGR**: Compound Annual Growth Rate based on monthly growth
   - Formula: `((1 + monthlyRate/100)^12 - 1) × 100`
   - Example: 4% monthly growth = 60.10% annual CAGR

2. **Month-by-Month Revenue**: Shows how revenue grows each month
   - Each month multiplies by `(1 + monthlyRate/100)`
   - Displays the dollar increase for each month

3. **Total Growth**: Shows total revenue increase over 12 months

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo Go app on your phone (for testing)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on your device:
   - **iOS**: Press `i` in the terminal or scan the QR code with your iPhone camera
   - **Android**: Press `a` in the terminal or scan the QR code with the Expo Go app
   - **Web**: Press `w` to open in your browser

## Usage

1. **Enter Initial Revenue**: Input your starting monthly revenue (e.g., $10,000)
2. **Enter Monthly Growth Rate**: Input your expected monthly growth percentage (e.g., 4%)
3. **View Results**:
   - See your annual CAGR prominently displayed
   - Review month-by-month revenue projections
   - See total growth over 12 months

## Example Scenario

- Initial Revenue: $10,000/month
- Monthly Growth: 4%
- Results:
  - Annual CAGR: 60.10%
  - After 12 months: $16,010
  - Total Growth: $6,010 (60.10% increase)

## Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS simulator (macOS only)
- `npm run web` - Run in web browser

## Built With

- [Expo](https://expo.dev/) - React Native framework
- [React Native](https://reactnative.dev/) - Mobile app framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## License

MIT

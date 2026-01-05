# Pleasure Vocabulary Builder

A premium, educational mobile application designed to help users explore and articulate the nuances of sexual pleasure through a curated design system and slide-based learning experience.

## ✨ Features

- **Interactive ConceptDeck**: A swipeable, slide-based learning journey for each concept, covering the "Why", "The Insight", Illustrations, and "Try This" reflections.
- **Exploration Library**: Browse concepts by category (Anatomy, Techniques, Sensation, Timing, Mindset) or through curated Pathways.
- **Atelier Dashboard**: A bento-style profile view that tracks your journey, highlights personal patterns, and manages your "Resonates" collection.
- **Modern UI/UX**: A warm, human-centric design using a rich coral and sage palette, editorial typography (Playfair Display), and smooth animations.
- **Pattern Insights**: Dynamic insights that surface your strongest category affinities as you explore.
- **Private & Local**: Your progress is stored locally on your device for privacy.

## 🛠 Tech Stack

- **Framework**: [Expo](https://expo.dev/) / [React Native](https://reactnative.dev/)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation)
- **Styling**: Standard React Native StyleSheet with a custom design system token system
- **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- **Database/Persistence**: AsyncStorage & SQLite
- **Icons**: Lucide Icons (via `@expo/vector-icons`)

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS)
- npm or yarn
- Expo Go app on your mobile device (for testing)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/cbrown564-alt/pleasure_vocab.git
   cd pleasure_vocab
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

4. Scan the QR code with your Expo Go app (Android) or Camera app (iOS) to view the app on your device.

## 🎨 Design System

The app utilizes a custom theme focused on warmth and education:
- **Primary**: Rich Coral (`#E8603C`) - Represents warmth and human connection.
- **Secondary**: Muted Sage (`#60846A`) - Represents calm, grounding, and growth.
- **Typography**: Playfair Display for headers (editorial feel), Inter for body text (clarity).

## 📂 Project Structure

- `/app`: Expo Router screens and layouts.
- `/components`: Reusable UI components (ConceptDeck, Cards, Bento, etc.).
- `/data`: Vocabulary definitions, pathway data, and expert explainers.
- `/assets`: Images, fonts, and brand assets.
- `/constants`: Theme tokens and global configuration.
- `/lib`: Custom hooks, user store, and utility functions.

## 📄 License

Private / Internal Project

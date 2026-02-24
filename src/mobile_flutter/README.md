# Biddt - Flutter Mobile App

A safe local bidding marketplace built with Flutter for iOS and Android.

## Architecture

This app follows **Clean Architecture** with:
- **Presentation Layer**: UI, Riverpod state management
- **Domain Layer**: Business logic, entities, use cases
- **Data Layer**: Repositories, data sources, models

## Project Structure

```
lib/
├── core/               # Shared code
│   ├── constants/      # Colors, typography, assets
│   ├── errors/         # Failure classes
│   ├── network/        # Dio config, interceptors
│   ├── storage/        # Local storage abstractions
│   ├── theme/          # Light/dark themes
│   └── utils/          # Extensions, helpers
├── data/               # Data layer
│   ├── datasources/    # Remote & local sources
│   ├── models/         # DTOs with JSON serialization
│   └── repositories/   # Repository implementations
├── domain/             # Domain layer
│   ├── entities/       # Business entities
│   ├── repositories/   # Repository interfaces
│   └── usecases/       # Business logic
├── presentation/       # UI layer
│   ├── blocs/          # State management
│   ├── pages/          # Screens
│   ├── widgets/        # Reusable components
│   └── providers/      # Riverpod providers
├── services/           # Services
│   ├── analytics/      # Firebase Analytics
│   ├── auth/           # Firebase Auth
│   ├── location/       # GPS, maps
│   ├── notifications/  # FCM, local notifs
│   └── payments/       # Stripe integration
└── main.dart
```

## Getting Started

### Prerequisites
- Flutter 3.19+
- Dart 3.3+
- Android Studio / Xcode
- Firebase project

### Installation

1. **Clone and navigate:**
```bash
cd biddt/src/mobile_flutter
```

2. **Install dependencies:**
```bash
flutter pub get
```

3. **Configure Firebase:**
   - Add `google-services.json` (Android) to `android/app/`
   - Add `GoogleService-Info.plist` (iOS) to `ios/Runner/`

4. **Run code generation:**
```bash
dart run build_runner build --delete-conflicting-outputs
```

5. **Run the app:**
```bash
flutter run
```

## Testing

### Run all tests:
```bash
flutter test
```

### Run with coverage:
```bash
flutter test --coverage
genhtml coverage/lcov.info -o coverage/html
```

### Test structure:
- `test/unit/` - Unit tests (business logic)
- `test/widget/` - Widget tests (UI components)
- `test/integration/` - Integration tests (end-to-end)

## Development Phases

### Phase 1: Foundation ✅
- [x] Project setup
- [x] Architecture structure
- [x] Theme system (light/dark)
- [x] Testing framework
- [ ] Firebase integration
- [ ] Navigation setup

### Phase 2: Auth (In Progress)
- [ ] Phone authentication
- [ ] Profile creation
- [ ] ID verification
- [ ] Trust score system

### Phase 3: Marketplace
- [ ] Home feed
- [ ] Search & filters
- [ ] Product details
- [ ] Create listing

### Phase 4: Bidding
- [ ] Real-time bidding
- [ ] Auto-bid
- [ ] Flash auctions
- [ ] Win/lose flows

### Phase 5: Transactions
- [ ] Wallet system
- [ ] Safe exchange
- [ ] QR verification
- [ ] Reviews

### Phase 6: Communication
- [ ] Chat
- [ ] Push notifications
- [ ] Sharing

## Code Style

- Follow `analysis_options.yaml`
- Use `flutter_lints` and `custom_lint`
- Run `flutter analyze` before committing
- Maintain 80%+ test coverage

## Team

See `FLUTTER_MASTER_PLAN.md` for full team structure and development roadmap.

## License

Proprietary - Biddt Project

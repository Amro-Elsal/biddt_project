// App.tsx
import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';

// Theme
import { useTheme } from './src/hooks/useTheme';
import { lightTheme, darkTheme } from './src/theme';

// Screens
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { PhoneAuthScreen } from './src/screens/PhoneAuthScreen';
import { ProfileSetupScreen } from './src/screens/ProfileSetupScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ProductDetailScreen } from './src/screens/ProductDetailScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { CreateListingScreen } from './src/screens/CreateListingScreen';
import { QRCodeScreen } from './src/screens/QRCodeScreen';
import { PaymentScreen } from './src/screens/PaymentScreen';
import { ChatListScreen } from './src/screens/ChatListScreen';
import { ChatScreen } from './src/screens/ChatScreen';
import { FlashAuctionsScreen } from './src/screens/FlashAuctionsScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import { SellerDashboardScreen } from './src/screens/SellerDashboardScreen';

// Types
export type RootStackParamList = {
  Onboarding: undefined;
  PhoneAuth: undefined;
  ProfileSetup: undefined;
  Main: undefined;
  ProductDetail: { listing?: any };
  CreateListing: undefined;
  QRCode: { type?: string; data?: any };
  Payment: { listing?: any };
  ChatList: undefined;
  Chat: { chatId?: string };
  Profile: undefined;
  SellerDashboard: undefined;
  Notifications: undefined;
  Wallet: undefined;
  MyListings: undefined;
  Watchlist: undefined;
  Reviews: undefined;
  Verification: undefined;
  Settings: undefined;
  Support: undefined;
  FlashAuctions: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Main Tab Navigator
function MainTabs({ theme }: { theme: any }) {
  const { colors } = theme;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ChatList') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'SellerDashboard') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home">
        {(props) => <HomeScreen {...props} theme={theme} />}
      </Tab.Screen>
      
      <Tab.Screen 
        name="ChatList" 
        options={{ tabBarLabel: 'Messages' }}
      >
        {(props) => <ChatListScreen {...props} theme={theme} />}
      </Tab.Screen>
      
      <Tab.Screen 
        name="SellerDashboard" 
        options={{ tabBarLabel: 'Selling' }}
      >
        {(props) => <SellerDashboardScreen {...props} theme={theme} />}
      </Tab.Screen>
      
      <Tab.Screen name="Profile">
        {(props) => <ProfileScreen {...props} theme={theme} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// Placeholder screens for navigation
function PlaceholderScreen({ name, theme }: { name: string; theme: any }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.textPrimary, fontSize: 18 }}>{name} Screen</Text>
    </View>
  );
}

export default function App() {
  const { theme, isDark } = useTheme();
  const { colors } = theme;

  const navigationTheme = {
    ...(isDark ? NavigationDarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? NavigationDarkTheme.colors : DefaultTheme.colors),
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.textPrimary,
      border: colors.border,
      notification: colors.live,
    },
  };

  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator
          initialRouteName="Onboarding"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Onboarding">
            {(props) => <OnboardingScreen {...props} theme={theme} />}
          </Stack.Screen>
          
          <Stack.Screen name="PhoneAuth">
            {(props) => <PhoneAuthScreen {...props} theme={theme} />}
          </Stack.Screen>
          
          <Stack.Screen name="ProfileSetup">
            {(props) => <ProfileSetupScreen {...props} theme={theme} />}
          </Stack.Screen>
          
          <Stack.Screen name="Main" component={MainTabs} />
          
          <Stack.Screen name="ProductDetail">
            {(props) => <ProductDetailScreen {...props} theme={theme} />}
          </Stack.Screen>
          
          <Stack.Screen name="CreateListing">
            {(props) => <CreateListingScreen {...props} theme={theme} />}
          </Stack.Screen>
          
          <Stack.Screen name="QRCode">
            {(props) => <QRCodeScreen {...props} theme={theme} />}
          </Stack.Screen>
          
          <Stack.Screen name="Payment">
            {(props) => <PaymentScreen {...props} theme={theme} />}
          </Stack.Screen>
          
          <Stack.Screen name="Chat">
            {(props) => <ChatScreen {...props} theme={theme} />}
          </Stack.Screen>
          
          {/* Placeholder screens */}
          <Stack.Screen name="Notifications">
            {(props) => <NotificationsScreen {...props} theme={theme} />}
          </Stack.Screen>

          <Stack.Screen name="FlashAuctions">
            {(props) => <FlashAuctionsScreen {...props} theme={theme} />}
          </Stack.Screen>
          
          <Stack.Screen name="Wallet">
            {(props) => <PlaceholderScreen name="Wallet" theme={theme} />}
          </Stack.Screen>
          
          <Stack.Screen name="MyListings">
            {(props) => <PlaceholderScreen name="My Listings" theme={theme} />}
          </Stack.Screen>
          
          <Stack.Screen name="Watchlist">
            {(props) => <PlaceholderScreen name="Watchlist" theme={theme} />}
          </Stack.Screen>
          
          <Stack.Screen name="Reviews">
            {(props) => <PlaceholderScreen name="Reviews" theme={theme} />}
          </Stack.Screen>
          
          <Stack.Screen name="Verification">
            {(props) => <PlaceholderScreen name="Verification" theme={theme} />}
          </Stack.Screen>
          
          <Stack.Screen name="Settings">
            {(props) => <PlaceholderScreen name="Settings" theme={theme} />}
          </Stack.Screen>
          
          <Stack.Screen name="Support">
            {(props) => <PlaceholderScreen name="Support" theme={theme} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

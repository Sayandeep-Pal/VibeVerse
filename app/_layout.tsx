import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Toaster } from 'sonner-native';
// import HomeScreen from "../screens/HomeScreen"
import { Stack } from 'expo-router';

// const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack>
      <Stack.Screen name="HomeScreen" />
    </Stack>
  );
}

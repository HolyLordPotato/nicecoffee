import { Platform } from 'react-native';

// Use localhost for web/iOS and Android emulator host mapping for Android.
export const API_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:3000'
  : 'http://localhost:3000';

  

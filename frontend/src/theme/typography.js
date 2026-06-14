import { Platform } from 'react-native';

export const FONTE_PRINCIPAL = Platform.select({
  ios: 'System',
  android: 'sans-serif-medium',
  default: 'System',
});

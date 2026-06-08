import { Platform } from 'react-native';

export const FONTE_PRINCIPAL = Platform.select({
  ios: 'Avenir Next',
  android: 'sans-serif-condensed',
  default: 'Arial',
});

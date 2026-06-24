import Constants from 'expo-constants';
import { Platform } from 'react-native';

function inferDevApiUrl() {
  const hostUri = Constants.expoConfig?.hostUri;

  if (!hostUri) {
    return null;
  }

  const hostname = hostUri.split(':')[0]?.trim();

  if (!hostname) {
    return null;
  }

  return `http://${hostname}:5000`;
}

const envApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
const inferredDevApiUrl = inferDevApiUrl();

const fallbackApiUrl = Platform.select({
  android: 'http://10.0.2.2:5000',
  ios: 'http://localhost:5000',
  web: 'http://localhost:5000',
  default: 'http://localhost:5000',
});

export const API_BASE_URL = (envApiUrl || inferredDevApiUrl || fallbackApiUrl || 'http://localhost:5000').replace(/\/+$/, '');

export function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export function getApiNetworkErrorMessage() {
  return [
    'Unable to reach the server.',
    `Current API base URL: ${API_BASE_URL}.`,
    'Make sure your backend is running and reachable from this device.',
    'If needed, set EXPO_PUBLIC_API_URL to your computer LAN IP, for example http://192.168.1.10:5000.',
  ].join(' ');
}

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ionic.project',
  appName: 'project',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;

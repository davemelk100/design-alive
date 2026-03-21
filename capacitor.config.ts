import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.themal.app",
  appName: "Themal",
  webDir: "dist",
  server: {
    // During development, point to the Vite dev server for live reload.
    // Uncomment the line below and run `npx cap run ios` or `npx cap run android`.
    // url: "http://YOUR_LOCAL_IP:5173",
    androidScheme: "https",
  },
  plugins: {
    StatusBar: {
      overlaysWebView: true,
    },
    SplashScreen: {
      launchAutoHide: false,
      androidScaleType: "CENTER_CROP",
    },
    Keyboard: {
      resize: "body",
      resizeOnFullScreen: true,
    },
  },
};

export default config;

import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.masjidnalepaar.prayerTime",
  appName: "prayerTime",
  webDir: "dist",
  server: {
    url: "https://masjid-nale-paar-namaz-time-six.vercel.app/",
    cleartext: false,
  },
};

export default config;

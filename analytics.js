import Analytics from "analytics";
import AmplitudePlugin from "@analytics/amplitude";

const analytics = Analytics({
  app: "Breew",
  plugins: [
    AmplitudePlugin({
      apiKey: "3cbdf284cf5493b776de55d22baa161f",
      options: {
        includeUtm: true,
        includeReferrer: true,
        trackingOptions: {
          city: true,
          country: true,
          ip_address: true,
          language: true,
          region: true,
          version_name: true,
          platform: true,
        },
      },
    }),
  ],
});

export default analytics;

import Analytics from 'analytics'
import AmplitudePlugin from '@analytics/amplitude'

const analytics = Analytics({
  app: "Cryptea",
  plugins: [
    AmplitudePlugin({
      apiKey: "3cbdf284cf5493b776de55d22baa161f",
      options: {
        includeUtm: true,
        includeReferrer: true,
        trackingOptions: {
          city: true,
          country: true,
          device_manufacturer: true,
          device_model: true,
          dma: true,
          ip_address: true,
          language: true,
          os_name: true,
          os_version: true,
          region: true,
          version_name: true,
          carrier: true,
          platform: true,
        },
      },
    }),
  ],
});

analytics.page(
  {
    path: '/',
    title: 'Home',
  },
)

analytics.track('req')

analytics.identify()

export default analytics
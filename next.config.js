const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
  // bcrypt is a native module and must not be bundled into the server build.
  // This replaces the old webpack `externals` hook, which Next 16 rejects now
  // that Turbopack is the default bundler.
  serverExternalPackages: ['bcrypt'],
  turbopack: {},
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;

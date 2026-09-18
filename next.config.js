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
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Browsers must not second-guess content types.
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // A financial portal has no business inside anyone's iframe.
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

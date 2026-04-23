import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  outputFileTracingExcludes: {
    '*': ['node_modules/next/dist/compiled/@vercel/og/**'],
  },
  images: {
    // 이미지 최적화 비활성화
    // 일일 접속 유지 1000명 이상되면 고려.
    unoptimized: true,
  },
};

export default nextConfig;

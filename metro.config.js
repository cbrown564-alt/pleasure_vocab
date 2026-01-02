const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable platform-specific extensions
// Metro will resolve .web.ts for web builds and .native.ts for native builds
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  'native.ts',
  'native.tsx',
  'web.ts',
  'web.tsx',
];

module.exports = config;

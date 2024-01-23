/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
    webpack(config, options) {
        config.module.rules.push({
            test: /\.(mp3)$/,
            use: {
              loader: 'file-loader',
              options: {
                publicPath: '/_next/static/sounds/',
                outputPath: 'static/sounds/',
                name: '[name].[ext]',
                esModule: false,
              },
            },
          });
      return config;
    },
  transpilePackages: [
      '@douyinfe/semi-ui',
    '@douyinfe/semi-icons',
    '@douyinfe/semi-illustrations'
  ],
}

module.exports = nextConfig

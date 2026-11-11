// Next.js is only the bundler and the server here: four static pages, each
// with one grid - see README.md
const fs = require('fs');
const path = require('path');

// the versions that are actually installed - shown on the pages and written
// to the report
function readPackageVersion(name) {
  try {
    const pkg = path.resolve(__dirname, 'node_modules', name, 'package.json');
    return JSON.parse(fs.readFileSync(pkg, 'utf8')).version;
  } catch (ex) {
    return 'unknown';
  }
}

module.exports = {
  webpack: (config, { dev, webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        // the spec refuses to measure a development build
        __DEV__: JSON.stringify(dev),
        __AG_GRID_VERSION__: JSON.stringify(
          readPackageVersion('ag-grid-community'),
        ),
        __INFINITE_VERSION__: JSON.stringify(
          readPackageVersion('@infinite-table/infinite-react'),
        ),
      }),
    );
    return config;
  },
  // double rendering in development would only get in the way when looking
  // at the pages - it has no effect on the production build that is measured
  reactStrictMode: false,
  // a type error after installing another version of a grid should not stop
  // the measurement - `npm run typecheck` checks the types
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

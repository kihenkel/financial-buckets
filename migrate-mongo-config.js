require('dotenv').config({ path: '.env.local' });

// Manually build MongoDB URL with authentication
const [protocol, url] = process.env.MONGODB_URL.split('//');
const authenticatedUrl = `${protocol}//${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${url}`;
const config = {
  mongodb: {
    url: authenticatedUrl,
    options: {
    }
  },
  migrationsDir: "mongodb-migrations",
  changelogCollectionName: "migrations",
  migrationFileExtension: ".js",
  useFileHash: false,
  moduleSystem: 'commonjs',
};

module.exports = config;

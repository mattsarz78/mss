// apollo.config.js
module.exports = {
  client: {
    service: {
      name: 'mss-app',
      // URL to the GraphQL API
      url: 'http://localhost:8020/graphql'
    },
    // Files processed by the extension
    includes: ['src/**/*.vue', 'src/**/*.js', 'src/**/*.ts']
  }
};

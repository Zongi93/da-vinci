const PROXY_CONFIG = [
  {
    target: 'http://localhost:3000',
    context: ['/api'],
    changeOrigin: true,
    loglevel: 'debug',
    secure: false
  }
];

module.exports = PROXY_CONFIG;

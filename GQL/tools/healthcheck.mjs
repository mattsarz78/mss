import http from 'http';

const options = {
  hostname: 'localhost',
  port: 8020,
  path: '/health',
  timeout: 5000
};

const req = http.request(options, (res) => {
  globalThis.console.log(`Health check status: ${res.statusCode}`);
  globalThis.process.exit(res.statusCode === 200 ? 0 : 1);
});

req.on('error', (err) => {
  globalThis.console.error('Health check failed:', err.message);
  globalThis.process.exit(1);
});

req.on('timeout', () => {
  globalThis.console.error('Health check timeout');
  globalThis.process.exit(1);
});

req.end();

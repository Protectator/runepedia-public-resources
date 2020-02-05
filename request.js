const http = require('http');
const https = require('https');

export const request = async (url, method = 'GET', postData) => {
  const lib = url.startsWith('https://') ? https : http;

  const [h, path] = url.split('://')[1].split('/');
  const [host, port] = h.split(':');

  const params = {
    method,
    host,
    port: port || url.startsWith('https://') ? 443 : 80,
    path: path || '/',
  };

  return new Promise((resolve, reject) => {
    const req = lib.request(params, res => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(`Status Code: ${res.statusCode}`));
      }

      const data = [];

      res.on('data', chunk => {
        data.push(chunk);
      });

      res.on('end', () => resolve(Buffer.concat(data).toString()));
    });

    req.on('error', reject);

    if (postData) {
      req.write(postData);
    }

    req.end();
  });
};

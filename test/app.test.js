const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

const app = require('../app');

function sendJsonRequest(path, method = 'POST', body = null) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const { port } = server.address();
      const req = http.request(
        {
          host: '127.0.0.1',
          port,
          path,
          method,
          headers: body ? { 'Content-Type': 'application/json' } : undefined,
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            server.close(() => resolve({ statusCode: res.statusCode, body: data }));
          });
        }
      );

      req.on('error', (err) => {
        server.close(() => reject(err));
      });

      if (body) {
        req.write(body);
      }
      req.end();
    });
  });
}

test('POST /tickets returns JSON error for malformed JSON', async () => {
  const result = await sendJsonRequest('/tickets', 'POST', '{bad json');
  assert.equal(result.statusCode, 400);
  assert.match(result.body, /"error"/i);
});

test('GET /tickets supports pagination', async () => {
  const result = await sendJsonRequest('/tickets?page=1&limit=1', 'GET');
  const json = JSON.parse(result.body);
  assert.equal(result.statusCode, 200);
  assert.equal(json.page, 1);
  assert.equal(json.limit, 1);
  assert.ok(Array.isArray(json.data));
});

test('GET /tickets/:id/notifications returns notifications for a ticket', async () => {
  const result = await sendJsonRequest('/tickets/does-not-exist/notifications', 'GET');
  const json = JSON.parse(result.body);
  assert.equal(result.statusCode, 200);
  assert.ok(Array.isArray(json));
});

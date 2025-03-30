import http from 'http'

import { environment } from './environment/index.js'
import { login, update, images, generateImage, getImages, logout } from './routes/index.js'


const server = http.createServer(async (req, res) => {
  const cookies = {};
  const allowedURLs = [
    'http://127.0.0.1:8080',
    environment.FE_DOMAIN
  ]
  const origin = req.headers.origin


  if (allowedURLs.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      return res.end();
    }
  }

  if (req.headers.cookie) {
    req.headers.cookie.split(';').forEach(cookie => {
      let [name, ...rest] = cookie.trim().split('=');
      cookies[name] = decodeURIComponent(rest.join('='));
    });
  }

  req.local = { cookies }
  const path = req.url

  switch (path) {
    case '/login':
      return login(req, res)

    case '/update':
      return update(req, res)

    case '/generate':
      return generateImage(req, res)

    case '/images':
      return getImages(req, res)

    case '/logout':
      return logout(req, res)
  }
})

server.listen(environment.PORT, () => {
  console.log(`Server is listening on PORT: ${environment.PORT}`)
})

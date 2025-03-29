import http from 'http'
import fsPath from 'fs/promises'
import fs from 'fs'
import path from 'path'
import busboy from 'busboy'
import { OpenAI } from 'openai'

import { environment } from './environment/index.js'
import { login, update, images } from './routes/index.js'

const openai = new OpenAI({
  apiKey: environment.OPENAI_API_KEY,
});

const generateImage = async (req, res) => {
  const bb = busboy({ headers: req.headers });
  let filePath = ""

  let base64Image = ''
  bb.on('file', (_, file, info) => {
    // filePath = path.resolve() + '/images' + '/' + info.filename
    // file.pipe(fs.createWriteStream(filePath));
    const chunks = [];

    file.on('data', (data) => {
      chunks.push(data);
    });

    file.on('end', () => {
      const buffer = Buffer.concat(chunks);
      base64Image = `data:${info.mimeType};base64,${buffer.toString('base64')}`;
    })
  });

  bb.on('finish', async () => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Turn this photo into a Studio Ghibli-style scene. Describe it for an artist or DALL·E." },
              { type: "image_url", image_url: { url: base64Image } }
            ]
          }
        ]
      });
      console.log("image URL:", response.data[0].url);
    } catch (err) {
      console.error(err);
    }
    res.end("Hello")
  });

  req.pipe(bb);
}

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

    case '/images':
      return images(req, res)

    case '/generate':
      return generateImage(req, res)
  }
})

server.listen(environment.PORT, () => {
  console.log(`Server is listening on PORT: ${environment.PORT}`)
})

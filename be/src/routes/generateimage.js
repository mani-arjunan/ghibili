import { environment } from "../environment/index.js"
import { OpenAI } from 'openai'
import { getDataFromToken } from "../utils.js";
import busboy from 'busboy'

const openai = new OpenAI({
  apiKey: environment.OPENAI_API_KEY,
});

export const generateImage = async (req, res) => {
  const method = req.method
  const excludedMethods = ['GET', 'PUT', 'PATCH', 'DELETE']

  if (excludedMethods.includes(method)) {
    res.writeHead(404)
    res.end(JSON.stringify({ status: "NOT_SUPPORTED", message: "Not Supported!" }))
    return
  }

  try {
    console.log(req.local.cookies)
    const details = getDataFromToken(req.local.cookies)

    if (!details) {

      res.writeHead(401)
      res.end(JSON.stringify({
        status: "UNAUTHORIZED",
        message: "Not logged in"
      }))
      return
    }
    const bb = busboy({ headers: req.headers });
    // let filePath = ""

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
  } catch (e) {
    console.log(e)
    res.writeHead(422)
    res.end(e)
  }
}

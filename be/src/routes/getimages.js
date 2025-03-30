import { getDataFromToken } from "../utils.js";

export const getImages = async (req, res) => {
  const method = req.method
  const excludedMethods = ['POST', 'PUT', 'PATCH', 'DELETE']

  if (excludedMethods.includes(method)) {
    res.writeHead(404)
    res.end(JSON.stringify({ status: "NOT_SUPPORTED", message: "Not Supported!" }))
    return
  }

  try {
    const details = getDataFromToken(req.local.cookies)

    if (!details) {
      res.writeHead(401)
      res.end(JSON.stringify({
        status: "UNAUTHORIZED",
        message: "Not logged in"
      }))
      return
    }
  } catch (e) {
    console.log(e)
    res.writeHead(422)
    res.end(e)
  }
}

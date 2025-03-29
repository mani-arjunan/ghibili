import { updateUser } from "../db/user.js"
import { parseBody, getDataFromToken } from "../utils.js"

export const images = async (req, res) => {
  const method = req.method
  const excludedMethods = ['PUT', 'POST', 'PATCH', 'DELETE']

  if (excludedMethods.includes(method)) {
    res.writeHead(404)
    res.end(JSON.stringify({ status: "NOT_SUPPORTED", message: "Not Supported!" }))
    return
  }
  try {
    return
  } catch (e) {
    console.log(e)
    res.writeHead(422)
    res.end(e)
  }
}

import { updateUser } from "../db/user.js"
import { parseBody, getDataFromToken } from "../utils.js"

export const update = async (req, res) => {
  const method = req.method
  const excludedMethods = ['GET', 'POST', 'PATCH', 'DELETE']

  if (excludedMethods.includes(method)) {
    res.writeHead(404)
    res.end(JSON.stringify({ status: "NOT_SUPPORTED", message: "Not Supported!" }))
    return
  }
  try {
    const body = await parseBody(req)
    const { username } = body

    if (!username) {
      res.writeHead(422);
      res.end(JSON.stringify({ status: "BAD_REQUEST", message: "username is Required" }))
      return;
    }

    const details = getDataFromToken(req.local.cookies)
    await updateUser({ username, mobileNumber: +details.mobileNumber })

    res.writeHead(200)
    res.end(JSON.stringify({
      status: "SUCCESS",
      message: "Success"
    }))
    return
  } catch (e) {
    console.log(e)
    res.writeHead(422)
    res.end(e)
  }
}

import { environment } from "../environment/index.js"

export const logout = async (req, res) => {
  const method = req.method
  const excludedMethods = ['PUT', 'POST', 'PATCH', 'DELETE']

  if (excludedMethods.includes(method)) {
    res.writeHead(404)
    res.end(JSON.stringify({ status: "NOT_SUPPORTED", message: "Not Supported!" }))
    return
  }

  const cookies = [
    `ghibili-token=''`,
    environment.FE_DOMAIN.includes('localhost') ? '' : `Domain=${environment.FE_DOMAIN}`,
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=None',
    `Max-Age=-1`
  ]

  res.writeHead(200, {
    'Set-Cookie': cookies.join(';'),
    'Content-Type': 'application/json'
  })
  res.end(JSON.stringify({
    status: "SUCCESS"
  }))
}

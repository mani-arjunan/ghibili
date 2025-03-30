import jwt from 'jsonwebtoken'
import { environment } from './environment/index.js'

export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000)
}


export function parseBody(req) {
  let data = ''
  return new Promise((res, rej) => {
    req.on('data', (d) => {
      data += d
    })

    req.on('end', () => {
      try {
        const parsedBody = JSON.parse(data)
        res(parsedBody)
      } catch (e) {
        rej("Payload is not valid json")
      }
    })
  })
}

export function generateJWT(payload) {
  const secret = environment.JWT_SECRET

  return jwt.sign(payload, secret, {
    expiresIn: '365d'
  })
}

export function getDataFromToken(cookies) {
  if (!cookies['ghibili-token']) {
    return null
  }
  const token = JSON.parse(cookies['ghibili-token'])

  try {
    const data = jwt.verify(token, environment.JWT_SECRET)

    return data
  } catch (e) {
    console.log(e)
    return null
  }
}

export function setCookie(res, token) {
  const cookieValue = encodeURIComponent(JSON.stringify(token));
  const maxAge = 99999999;
  const cookies = [
    `ghibili-token=${cookieValue}`,
    environment.FE_DOMAIN.includes('localhost') ? '' : `Domain=${environment.FE_DOMAIN}`,
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=None',
    `Max-Age=${maxAge}`

  ]

  res.writeHead(200, {
    'Set-Cookie': cookies.join(';'),
    'Content-Type': 'application/json'
  });
}

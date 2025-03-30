import { insertUser, isUserAvailable, setOTPtoMem } from "../db/user.js"
import { environment } from "../environment/index.js"
import { generateJWT, parseBody, setCookie } from "../utils.js"
import crypto from 'crypto'

export const login = async (req, res) => {
  const method = req.method
  const excludedMethods = ['GET', 'PUT', 'PATCH', 'DELETE']

  if (excludedMethods.includes(method)) {
    res.writeHead(404)
    res.end(JSON.stringify({ status: "NOT_SUPPORTED", message: "Not Supported!" }))
    return
  }
  try {
    const body = await parseBody(req)
    const { mobileNumber, password } = body

    if (!mobileNumber) {
      res.writeHead(422);
      res.end(JSON.stringify({
        status: "BAD_REQUEST",
        message: "Mobile Number is Required"
      }))
      return;
    }

    if (!password) {
      res.writeHead(422);
      res.end(JSON.stringify({
        status: "BAD_REQUEST",
        message: "Password is Required"
      }))
      return;
    }

    if (isNaN(+mobileNumber)) {
      res.writeHead(422);
      res.end(JSON.stringify({
        status: "BAD_REQUEST",
        message: "Mobile number should be of type number"
      }))
      return;
    }

    if (mobileNumber.toString().length !== 10) {
      res.writeHead(422);
      res.end(JSON.stringify({
        status: "BAD_REQUEST",
        message: "Mobile number should be of 10 numbers"
      }))
      return;
    }

    const users = await isUserAvailable(mobileNumber)
    const token = generateJWT({ mobileNumber })

    if (users.length === 0) {
      const [user] = await insertUser({
        mobileNumber,
        password: crypto.hash('sha1', password)
      })

      setCookie(res, token)
      res.end(JSON.stringify({
        status: "NEW_USER",
        message: {
          name: '',
          mobileNumber: user.mobile_number
        }
      }))
      return
    }

    const user = users[0]

    if (user.password !== crypto.hash('sha1', password)) {
      res.writeHead(401)
      res.end(JSON.stringify({
        status: "PASSWORD_ERR",
        message: "Wrong Password",
      }))
      return
    }

    setCookie(res, token)
    res.end(JSON.stringify({
      status: "SUCCESS",
      message: {
        name: user.name,
        mobileNumber: user.mobile_number
      }
    }))
    return
  } catch (e) {
    console.log(e)
    res.writeHead(422)
    res.end(e)
  }
}

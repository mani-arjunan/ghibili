import { DatabaseConnection } from './index.js'
import { RedisConnection } from './redis.js'

export const isUserAvailable = async (mobileNumber) => {
  const knex = DatabaseConnection.knex

  try {
    const users = await knex.raw(`
      SELECT * FROM users u
      WHERE u.mobile_number=${mobileNumber}
    `)
    return users.rows
  } catch (e) {
    console.log(e)
  }
}

export const insertUser = async ({ password, mobileNumber }) => {
  const knex = DatabaseConnection.knex

  try {
    const users = await knex.raw(`
      INSERT INTO users (mobile_number, password)
      VALUES ('${mobileNumber}', '${password}')
    `)

    return users.rows
  } catch (e) {
    console.log(e)
  }
}

export const updateUser = async ({ username, mobileNumber }) => {
  const knex = DatabaseConnection.knex

  try {
    const users = await knex.raw(`
        UPDATE users
        SET name='${username}'
        WHERE mobile_number=${mobileNumber}
    `)

    return users.rows
  } catch (e) {
    console.log(e)
  }
}

export const setOTPtoMem = async (key, val) => {
  const redis = await RedisConnection.redis()

  try {
    await redis.set(key.toString(), JSON.stringify(val), { EX: 120 })
  } catch (e) {
    console.log(e)
  }

}

export const validateOTP = async (key, value) => {
  const redis = await RedisConnection.redis()

  const val = await redis.get(key.toString())

  if (!val) {
    return false
  }
  const redisValue = JSON.parse(val)
  const { otp, attempt } = redisValue


  if (attempt === 5) {
    await redis.del(key.toString())
    return false
  }

  if (otp !== value) {
    const remainingTTL = await redis.ttl(key.toString());
    const updatedRedisValue = {
      ...redisValue,
      attempt: +redisValue.attempt + 1
    }

    await redis.set(key.toString(), JSON.stringify(updatedRedisValue), { EX: remainingTTL })
    return false
  }

  await redis.del(key.toString())
  return true
}

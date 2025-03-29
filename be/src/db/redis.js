import { createClient } from 'redis'

export class RedisConnection {
  static _redis = null;

  constructor() { }

  async init() {
    const client = createClient({
      socket: {
        port: 6380,
        host: "192.168.0.111",
      },
    });

    try {
      await client.connect();
    } catch (e) {
      console.log(e);
    }

    return client;
  }

  static shutdown() {
    return new Promise((resolve, reject) => {
      if (this._redis) {
        this._redis.quit();
        resolve();
      } else {
        reject("Redis was not initialized");
      }
    });
  }

  static async redis() {
    if (!this._redis) {
      this._redis = await new RedisConnection().init();
    }
    return this._redis;
  }
}

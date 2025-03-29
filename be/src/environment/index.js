const env = process.env;

export const environment = {
  PORT: env.PORT || 3000,
  HOST: env.HOST || "localhost",
  PG_URI: env.PG_URI,
  JWT_SECRET: env.JWT_SECRET,
  FE_DOMAIN: env.FE_DOMAIN || 'http://localhost:8080',
  OPENAI_API_KEY: env.OPENAI_API_KEY
};

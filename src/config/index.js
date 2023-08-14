import 'dotenv/config'

export const TOKEN_SECRET = process.env.SECRET_KEY

export const DB_CONFIG = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE_NAME
}
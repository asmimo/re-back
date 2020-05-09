import dotenv from 'dotenv'
dotenv.config()

export const admin = {
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
  loginJWT: process.env.ADMIN_LOGIN_JWT,
}

const nodemailer = {
  email: process.env.MAIL_ID,
  password: process.env.MAIL_PASSWORD,
}

const config = {
  admin,
  nodemailer,
}

export default config

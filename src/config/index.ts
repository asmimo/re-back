import dotenv from 'dotenv'
dotenv.config()

const nodemailer = {
  email: process.env.MAIL_ID,
  password: process.env.MAIL_PASSWORD,
}

const config = {
  nodemailer,
}

export default config

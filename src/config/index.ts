import dotenv from 'dotenv'
dotenv.config()

export const admin = {
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
  loginJWT: process.env.ADMIN_LOGIN_JWT,
}

const user = {
  registerJWT: process.env.USER_REGISTER_JWT,
  loginJWT: process.env.USER_LOGIN_JWT,
  twoStepJWT: process.env.USER_TWO_STEP_JWT,
  forgotPasswordJWT: process.env.USER_FORGOT_PASSWORD_JWT,
}

const nodemailer = {
  email: process.env.MAIL_ID,
  password: process.env.MAIL_PASSWORD,
}

const config = {
  admin,
  user,
  nodemailer,
}

export default config

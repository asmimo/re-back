import nodemailer, { SendMailOptions } from 'nodemailer'
import pino from 'pino'

import config from '../config'

interface sendMailProps {
  to: SendMailOptions['to']
  subject: SendMailOptions['subject']
  html: SendMailOptions['html']
}

const sendMail = async ({ to, subject, html }: sendMailProps) => {
  try {
    const transporter = nodemailer.createTransport(
      `smtps://${config.nodemailer.email}:${config.nodemailer.password}@smtp.gmail.com`,
    )

    const mailOptions: SendMailOptions = {
      from: `"Re-back 👻" <${config.nodemailer.email}>`,
      to,
      subject,
      html,
    }

    const info = await transporter.sendMail(mailOptions)
    pino().info(info)
  } catch (error) {
    pino().error(error)
  }
}

export default sendMail

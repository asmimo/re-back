import { resolve } from 'url'
import { sign } from 'jsonwebtoken'

import { User } from '../../modules/user/user.entity'
import sendMail from '../sendMail'
import config from '../../config'

const sendEmailVerification = (user: User) => {
  const payload = { id: user.id }
  const token = sign(payload, config.user.registerJWT!, { expiresIn: '48h' })
  const url = resolve(config.appUrl!, `/api/email/verification?token=${token}`)

  const options = {
    to: user.email,
    subject: `[Re-back] Verify your email address`,
    html: `Welcome ${user.username},
    <br><br>
    Visit this link within 48 hours to verify your email address:
    <br><br>
    <a href="${url}">${url}</a>
    <br><br>
    If you have any questions, just reply to this email. We're always happy to help out.
    <br><br>
    By:
    <br>
    Reback Team`,
  }

  sendMail(options)
}

export default sendEmailVerification

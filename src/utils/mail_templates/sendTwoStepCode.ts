import { User } from '../../modules/user/user.entity'
import sendMail from '../sendMail'

const sendTwoStepCode = (user: User) => {
  const options = {
    to: user.email,
    subject: `[Re-back] Verify your email address`,
    html: `Welcome ${user.username},
    <br><br>
    Use the verification code below to log in:
    <br>
    ${user.two_step_code}
    <br><br>
    If you have any questions, just reply to this email. We're always happy to help out.
    <br><br>
    By:
    <br>
    Reback Team`,
  }

  sendMail(options)
}

export default sendTwoStepCode

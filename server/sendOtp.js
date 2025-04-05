const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendOtp = async (phone) => {
  try {
    const verification = await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications
      .create({ to: phone, channel: 'sms' });

    return verification.status; // Return the status of the verification request
  } catch (error) {
    throw new Error('Error sending OTP: ' + error.message);
  }
};

module.exports = { sendOtp };

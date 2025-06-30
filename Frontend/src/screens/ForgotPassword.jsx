import { useState } from 'react';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const sendOTP = async () => {
    await axios.post('http://localhost:8000/api/auth/send-otp', { email });
    setOtpSent(true);
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <button onClick={sendOTP}>Send OTP</button>

      {otpSent && <VerifyOTP email={email} />}
    </div>
  );
}

import { useState } from 'react';
import axios from 'axios';

export default function VerifyOTP({ email }) {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [done, setDone] = useState(false);

  const resetPassword = async () => {
    await axios.post('http://localhost:8000/api/auth/reset-password', { email, otp, newPassword });
    setDone(true);
  };

  if (done) return <p>Password updated. You can login now.</p>;

  return (
    <div>
      <h3>Enter OTP and New Password</h3>
      <input placeholder="OTP" onChange={e => setOtp(e.target.value)} />
      <input placeholder="New Password" onChange={e => setNewPassword(e.target.value)} />
      <button onClick={resetPassword}>Reset Password</button>
    </div>
  );
}

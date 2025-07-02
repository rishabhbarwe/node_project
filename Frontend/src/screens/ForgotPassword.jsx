import { useState } from 'react';
import axios from 'axios';
import emailimg from '../assets/email.png'

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendOTP = async () => {
    await axios.post('http://localhost:8000/api/auth/send-otp', { email });
    setOtpSent(true);
  };

  return (
    <div style={{
      width : "100%",
      height : "100vh",
      backgroundColor : "#669bbc",
      
    }} className='d-flex justify-content-center align-items-center'>
      <div style={{
        borderRadius: 20,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        padding: 30,
        boxShadow: "-10 0 20",
        width: 450,

      }} className='flex-column justify-content-center align-items-center'>
      <p style={{
        textAlign : 'center',
          }} className='fw-bold text-white fs-3'>Forgot Password</p>
      <div className='position-relative'>
        <input  className="form-control" placeholder="Email" onChange={e => setEmail(e.target.value)} style={{paddingLeft : 35}}/>
        <img src={emailimg} alt="" width={25} className="icons position-absolute" style={{ right: 10, top: 7 }} />
      </div>
      
      <div className='text-center'><button className="btn btn-primary w-50 align-self-center rounded-3 my-5" onClick={sendOTP} disabled={loading}>
                {loading ? (
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      ) : (
        "Send OTP"
      )}
              </button></div>

      {otpSent && <VerifyOTP email={email} />}
    </div>
    </div>
  );
}

import React from "react";
import eye from '../assets/eye.png'
import hidden from '../assets/hidden.png'
import name from '../assets/name.png'
import email from '../assets/email.png'
import phone from '../assets/phone.png'
import username from '../assets/username.png'
import lock from '../assets/lock.png'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register,login } from "../authAPI/authService";







const Signup = () => {
 
  const navigate = useNavigate();
  const [showPass , setShowPass] = useState(false);
  const [loading, setLoading] = useState(false); // 1️⃣ Loading state until reposnse is recieved from api
  const [errorMsg, setErrorMsg] = useState(null); // 1️⃣ For showing error if mail/username already exist


  const handleImage = ()=>{
    setShowPass(!showPass)  
}

  const redirectToLogin = () => {
        navigate("/login");
  }

  const [formData, setFormdata] = useState({
    usertype : "",
    name : "",
    username : "",
    phone : "",
    email : "",
    password : ""
});

const [error, setError] = useState({
  usertype : "",
  name : "",
  username : "",
  phone : "",
  email : "",
  password : ""
});






const handleChange = (event)=>{
  //  const name = event.target.name;//selet
  //  const value = event.target.value//tenant
  const {name,value} = event.target;

   setFormdata((data)=>({...data,[name]:value}))
   
}

const Validate = ()=>{
    let valid = true;
     let errors={}

    if(!formData.usertype){
      errors.usertype = "Please usertype your type"
      valid = false;
    }
    if(!formData.name){
      errors.name = "Please enter your name"
      valid = false;
    }
    if(!formData.username){
       errors.username = "Please enter your username"
      valid = false;
    }
    if(!formData.phone){
       errors.phone = "Please enter your phone"
      valid = false;
    }
    if(!formData.email){
       errors.email = "Please enter your email"
      valid = false;
    }
    if(!formData.password){
       errors.password = "Please enter your password"
       valid = false;
    }




  setError(errors)

  return valid;
}

function showToast() {
    const container = document.getElementById("modalToastContainer");
    if (!container) return;

    const alert = document.createElement("div");
    alert.className =
      "alert alert-info text-center fw-bold p-2 px-3 my-2 shadow-sm ";
    alert.innerText = errorMsg;

    container.appendChild(alert);

    setTimeout(() => alert.remove(), 5000);
  }

const handleSubmit = async(e)=>{
    e.preventDefault();
    console.log("Formdata : ",formData);
    if(Validate()){
      setLoading(true);

      // localStorage.setItem('signupdata',JSON.stringify(formData));
      try{
          const response = await register(formData);
          console.log("Hello from Signup")
          console.log('Registered successfully:', response.data);
          navigate('/login');
      }catch(error){
         const errorData = error.response?.data;

  if (errorData) {
    if (errorData.username) {
      setErrorMsg(errorData.username[0]);  // show username error first
    } else if (errorData.email) {
      setErrorMsg("A user with that email id already exists.");     // show email error only if username is okay
    } else {
      setErrorMsg("Something went wrong. Please try again.");
    }
    showToast(); // or show alert
  } else {
    setErrorMsg("Something went wrong. Please try again.");
  }
      }
      setLoading(false); // 3️⃣ Hide spinner
     
    }

}
  

  
  return (
    
    <div className="container-fluid ">
      <div className="row fullScreen">
       
       
       <div className="col-12 signupForm">
          {/* signup form */}
          <div className="row">
            <div className="col-12 text-center mt-4">
              <p className="h3 text-danger topText">Find Your Perfect Room — Anytime, Anywhere!</p>
            </div>
          </div>
          <div className="signupFormDiv">
            
            <h4 className="text-center">Register please!</h4>
             <div id="modalToastContainer" className="position-absolute top-0 end-1 ms-0 px-3 py-3 mt-0" style={{ zIndex: 1100 }}></div>
            <form>
            <div>
              <label htmlFor="type">Select type</label><br />
                 
                 <select id="type" name="usertype" value={formData.usertype} onChange={handleChange}>
                   <option value="">--Select user type--</option>
                   <option value="owner">Owner</option>
                   <option value="tenant">Tenant</option>
                 </select>
                 {error.usertype && <p  className="errorsMessage" >{error.usertype}</p>}
              </div>
              <div className="itemDiv">
                <label htmlFor="name">Name</label><br />
                <input  type="text" id="name" placeholder="name" name="name" value={formData.name} onChange={handleChange} ></input>
                {error.name && <p  className="errorsMessage" >{error.name}</p>}
                <img src={name} alt="" width={20}  className="icons"/>
              </div>
              <div className="itemDiv">
                <label htmlFor="username">Username</label><br />
                <input type="text" id="username" placeholder="username" name="username" value={formData.username} onChange={handleChange}></input>
                {error.username && <p  className="errorsMessage" >{error.username}</p>}
                <img src={username} alt="" width={20}  className="icons"/>
              </div>
              <div className="itemDiv">
                <label htmlFor="phone">Phone</label><br />
                <input type="text" id="phone" placeholder="phone no" name="phone" value={formData.phone} onChange={handleChange}></input>
                {error.phone && <p className="errorsMessage" >{error.phone}</p>}
                <img src={phone} alt="" width={20} className="icons"/>
              </div>
              <div className="itemDiv">
                <label htmlFor="email">Email</label><br />
                <input type="text" id="email" placeholder="email" name="email" value={formData.email} onChange={handleChange}></input>
                {error.email && <p   className="errorsMessage">{error.email}</p>}
                <img src={email} alt="" width={20} className="icons"/>
              </div>
              <div className="itemDiv">
                <label htmlFor="password">Password</label><br />
                <input type={showPass ? "text" : "password"} id="password" placeholder="password" name="password" value={formData.password} onChange={handleChange}></input>
                {error.password && <p  className="errorsMessage" >{error.password}</p>}
                <img src={lock} alt="" width={20}  className="icons"/>
                <img src={showPass ? hidden : eye} width={18} style={{
                     position : "absolute",
                     top : 51,
                     right : 14,
                }} onClick={handleImage}></img>
              </div>
             
               <button className="btn btn-primary w-50 align-self-center rounded-3 mx-4 mt-4" onClick={handleSubmit} disabled={loading}>
                {loading ? (
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      ) : (
        "Signup"
      )}
              </button>
              <div className="text-center d-flex justify-content-center align-items-center text-white ms-3 mt-2">Already have an account?<button type="button" class="btn text-danger text-decoration-underline" onClick={redirectToLogin}>Login</button></div>
              
            </form>
          </div>
        </div>
       
      </div>
    </div>
  );
};

export default Signup;

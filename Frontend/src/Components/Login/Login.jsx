import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { toast } from "react-toastify";
import "./Login.css"
const Login = () => {
const [slide,setslide]=useState(true);
const [email, setEmail] = useState("");
const [name, setName] = useState("");
const [password, setPassword] = useState("");
const [signupEmail, setSignupEmail] = useState("");
const [signupPassword, setSignupPassword] = useState("");
const [signupKey, setSignupKey] = useState("");
const [forgotemail, setForgotemail] = useState("");
const [forgotkey, setForgotkey] = useState("");
const [newpassword, setNewpassword] = useState("");
const[forgotpage,setForgotpage]=useState(false);
const [mobile,setMobile]=useState(false)
useEffect(() => {
    if (forgotpage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [forgotpage]);
const handleforgotpassword=async(e)=>{
    e.preventDefault();
    try{
   const res= await axios.post("/api/user/forgotpassword",{email:forgotemail,key:forgotkey,password:newpassword},{withCredentials:true})
   toast.success(res.data.response || "Successfully changed password please login");
   setForgotpage(false);
    }
    catch(err){
            toast.error(err.response?.data.response || "Something went wrong. Please try again");
    }
}
const handlesignup=async(e)=>{
    e.preventDefault();
    try{
        const res= await axios.post("/api/user/register",{email:signupEmail,password:signupPassword,key:signupKey,name:name},{withCredentials:true})
        toast.success(res.data.response || "Signup successful!");
        setSignupEmail("")
        setSignupPassword("")
        setSignupKey("")
    }
    catch(err){
        toast.error(err.response?.data?.response || "Something went wrong. Please try again");
    }
}
  const handlelogin= async(e)=>{
    e.preventDefault();
    try{
        const res=await axios.post("/api/user/login",{email,password},{withCredentials:true});
        toast.success(res.data.response || "login successful!");
        window.location.reload(); 
    }
    catch(err){
        toast.error(err.response?.data?.response || "Something went wrong. Please try again");
        console.log(err)
    }
  }
    return (
    <div className="login_page">
        {forgotpage ?
        <div className="forgot_password_page"> 
            <div className="forgot_block">
                <form onSubmit={handleforgotpassword} >
                <label style={{display:"flex"}}><h2>Enter User credientials</h2>
                <svg style={{marginLeft:"auto"}} onClick={()=>{setForgotpage(false)}} xmlns="http://www.w3.org/20}00/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                </label>
                <label><p style={{marginLeft:"5px",marginTop:"5px"}}>Email Adress</p><input type="text"  placeholder='Email adress'onChange={(e)=>setForgotemail(e.target.value)}  autoComplete="username"/></label>
                <label><p style={{marginLeft:"5px",marginTop:"5px"}}>Key</p><input type="password" placeholder='key' onChange={(e)=>setForgotkey(e.target.value)} autoComplete="key"/></label>
                <label><p style={{marginLeft:"5px",marginTop:"5px"}}>New Password</p><input type="password" placeholder='New password' onChange={(e)=>setNewpassword(e.target.value)} autoComplete="new-password"/></label>
                <button className='login_submit_button' style={{marginLeft:"5px",marginTop:"20px"}}>Submit</button>
                </form>
            </div>
        </div>
        :null}
        <div className="login_signup_container">
            <div className="login_container">
                <form onSubmit={handlelogin} >
                <h1 style={{marginTop:"auto",textDecoration:"underline"}}>LOGIN</h1>
                <div className="login_Credentials_container">
                <div className="username_input_container">
                    <p style={{marginLeft:"5px",marginTop:"5px"}}>Email Adress</p>
                    <input type="text" className='login_input' placeholder='Enter Email Adress' value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
                </div>
                <div className="username_input_container">
                    <p style={{marginLeft:"5px",marginTop:"5px"}} >Password</p>
                    <input type="password" autoComplete="current-password" className='login_input' placeholder='Enter Password'  value={password} onChange={(e) => setPassword(e.target.value)} />
                    <p style={{marginLeft:"70%",width:"max-content",marginTop:"7px"}} onClick={()=>{setForgotpage(true)}}>forgot Password?</p>
                </div>
                <button className='login_submit_button'>Submit</button>
                </div>
                <p id='bottom_right_new_user' style={{marginLeft:"60%",width:"max-content",marginRight:'40px'}} onClick={()=>{setslide(!slide)}}>New user <span style={{color:"#0048FF"}} >signup?</span></p>
            </form>
            </div>
            <div className="signup_container">
                <form onSubmit={handlesignup} >
            <div className={`bluescreen_${slide ? "right" : "left"}`}></div>
            <h1 style={{marginTop:"auto",textDecoration:"underline"}}>Signup</h1>
                <div className="login_Credentials_container">
                <div className="username_input_container">
                    <p style={{marginLeft:"5px",marginTop:"10px"}}>Email Adress</p>
                    <input type="text" className='login_input' placeholder='Enter Email Adress' value={signupEmail} onChange={(e)=>setSignupEmail(e.target.value)} autoComplete="username" />
                </div>
                <div className="username_input_container">
                    <p style={{marginLeft:"5px",marginTop:"5px"}}>Password</p>
                    <input type="password" autoComplete="new-password" className='login_input' placeholder='Enter Password' value={signupPassword} onChange={(e)=>setSignupPassword(e.target.value)}/>
                </div>
                <div className="username_input_container">
                    <p style={{marginLeft:"5px",marginTop:"5px"}}>Name</p>
                    <input type="text" autoComplete="new-name" className='login_input' placeholder='Enter Name' value={name} onChange={(e)=>setName(e.target.value)}/>
                </div>
                <div className="username_input_container">
                <p style={{marginLeft:"5px",marginTop:"5px"}}>Key</p>
                    <input type="password" autoComplete="new-password" id='additional_input' placeholder='Enter Key' value={signupKey} onChange={(e)=>setSignupKey(e.target.value)}/>
                    <p style={{marginLeft:"5px",marginTop:"5px",fontSize:"13px",marginBottom:"10px",width:"140%"}} id='key_input' >Enter any additional information or a security code that will help you recover your account</p>
                </div>
                <button className='login_submit_button' style={{marginLeft:"5px"}}>Submit</button>
                </div>
                <p id='bottom_right_new_user'  onClick={()=>{setslide(!slide)}}>Already an user <span style={{color:"#0048FF"}}>Login?</span></p>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Login

import "./Navbar.css";
import React, { useEffect, useState } from 'react'
import { useTheme } from "../../Context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
const Navbar = () => {
    const [active, setActive] = useState(false);
    const [userpopup, setUserpopup] = useState(false);
    const[userdata,setUserdata]=useState(""); 
    const[loaduserdata,setloaduserdata]=useState(true); 
    const{theme,toggleTheme} = useTheme();
    const navigate=useNavigate();
    const handlelogout=async(e)=>{
      e.preventDefault();
      try{
        await axios.post("/api/user/logout")
        toast.success("Logged out successfully");
        window.location.reload(); 
      }
      catch(err){
        toast.error("Something went wrong. Please try again");
      }
    }
    useEffect(() => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("usertoken="))
        ?.split("=")[1];
    
      if (token) {
        axios.get("/api/user/loggeduser", {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
          setUserdata(res.data.response);
          setloaduserdata(false);
        })
        .catch(err => {
          console.log("Error fetching user data:", err);
        });
      }
    }, []);
  return (
        <div className='Navbar'>
        <div className="dark-light-toggler">
            <div className="brand_image_text">
              {theme==="light" ? <img src="./datatheme-light.png" alt="brand_logo" className="brand_logo" style={{filter:"invert(1)"}} /> :
                <img src="./datatheme-light.png" alt="brand_logo" className="brand_logo" />}
                <h2>ThinkSpace</h2>
            </div>
            <div className="navbar_options">
              <h3 onClick={()=>{navigate('/')}}>HOME</h3>
              <h3 onClick={()=>{navigate('/classroom')}}>CLASSROOM</h3>
              <h3 onClick={()=>{navigate('/notespace')}}>NOTESPACE</h3>
              <h3 onClick={()=>{navigate('/login')}}>LOGIN</h3>
            </div>
            <div className={`toggler_button ${active ? 'active' : ''}`} onClick={()=>{setActive(!active),toggleTheme()}}>
              <div className="toggler_circle"></div>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M440-760v-160h80v160h-80Zm266 110-55-55 112-115 56 57-113 113Zm54 210v-80h160v80H760ZM440-40v-160h80v160h-80ZM254-652 140-763l57-56 113 113-56 54Zm508 512L651-255l54-54 114 110-57 59ZM40-440v-80h160v80H40Zm157 300-56-57 112-112 29 27 29 28-114 114Zm283-100q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Zm0-80q66 0 113-47t47-113q0-66-47-113t-113-47q-66 0-113 47t-47 113q0 66 47 113t113 47Zm0-160Z"/></svg>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M484-80q-84 0-157.5-32t-128-86.5Q144-253 112-326.5T80-484q0-146 93-257.5T410-880q-18 99 11 193.5T521-521q71 71 165.5 100T880-410q-26 144-138 237T484-80Zm0-80q88 0 163-44t118-121q-86-8-163-43.5T464-465q-61-61-97-138t-43-163q-77 43-120.5 118.5T160-484q0 135 94.5 229.5T484-160Zm-20-305Z"/></svg>
            </div>

          </div>
            <div className="profile_section">
            <div className="profile_icon_bg" onClick={()=>{setUserpopup(!userpopup)}}>
              {
                theme==="light" ? <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#000000"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/></svg> :
                <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#ffffff"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/></svg>
              }
         {     userpopup ?
          <div className="user_information">
                {loaduserdata ? <div style={{marginLeft:"10px"}}>  <h3 >Please login to get user information</h3>  <button onClick={()=>{navigate("/login")}}>Login</button></div> : 
                <div> 
                  <h3>Welcome,{userdata.name}</h3>
                  <h3>{userdata.email}</h3> 
                  <button onClick={handlelogout}>Logout</button>
                </div> }
                </div> : null}
            </div>
            </div>
            <div className="profile_section_phone">
            <div className="profile_icon_bg_phone" onClick={()=>navigate("/login")}>
              {
                theme==="light" ? <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#000000"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/></svg> :
                <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#ffffff"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/></svg>
              }

            </div>
            </div>
                <div className="menubar">
                  <div className="menu_icon_bg">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
                </div>
              </div>
          </div>
  )
}

export default Navbar

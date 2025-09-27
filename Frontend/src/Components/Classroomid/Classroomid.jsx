import React, { useContext, useEffect, useState, useSyncExternalStore,useRef } from 'react'
import "./classroomid.css"
import { io } from "socket.io-client";
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { Username } from '../../Context/Username'
import { useTheme } from "../../Context/ThemeContext";
import {Userid} from "../../Context/UserId"
import { Navigate } from 'react-router-dom';
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;

const Classroomid = () => {
  const navigate=useNavigate();
  const{theme,toggleTheme} = useTheme();
  const { userId } = Userid();
  const [isopen,setisopen]=useState(false);
  const[startchat,setstartchat]=useState(false);
  const[userpopup,setuserpopup]=useState(false);
  const[Aipopup,setAipopup]=useState(false);
  const[userdata,setUserdata]=useState({});
  const[message,setmessage]=useState("")
  const[chatdata,setChatData]=useState([])
  const[send,setSend]=useState(false)
  const[roomdetails,setRomDetails]=useState(false)
  const chatScroller = useRef(null);
  const {username}=Username();
  const {id}=useParams();
  const[sentby,setSentBy]=useState("friend")

  useEffect(()=>{
    const fetchRoomname=async ()=>{
      try{
      const res = await axios.get(`/api/room/present/${id}`);
      setRomDetails(res.data);
      }catch(err){
        toast.error("room is not available")
      }

    }
    fetchRoomname();
  },[])
  useEffect(() => {
      if (chatScroller.current) {
          chatScroller.current.scrollTop = chatScroller.current.scrollHeight;
      }
  }, [chatdata]);
      useEffect(() => {
          if (send) {
            const timer = setTimeout(() => setSend(false), 1000); // reset after animation duration
            return () => clearTimeout(timer);
          }
        }, [send]);
        useEffect(() => {
          const socket = io(import.meta.env.VITE_BACKEND_URL, {
            transports: ["websocket"], // force websocket
            withCredentials: true      // send cookies if any
          });
        
          socket.emit("joinRoom", id);
        
          socket.on("newMessage", (msg) => {   
            setChatData(prev => [...prev, msg]);
          });
        
          return () => {
            socket.disconnect();
          };
        }, [id]);
  useEffect(() => {
    const handleuserdata = async () => {
      try {
        const res = await axios.get("/api/user/loggeduser", { withCredentials: true });
        setUserdata(res.data);
      } catch (err) {
        setUserdata({});
        toast.info("You are not logged in");
      }
    };
    handleuserdata();
  }, []);
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      const res = await axios.post(
        "/api/chat/send",
        { user: username, room: id, text: message ,userid:userId},
        { withCredentials: true }
      );
   
      setmessage("");
  
      toast.success("Message sent");
    } catch (err) {
      toast.error("Unable to send message");
      console.log(err);
    }
  };
  return (
    <div className='classroom_id_page' onClick={()=>{setuserpopup(false)}}>
      <div className="classroom_id_sidebar_collapsed">
        <div className='classroom_id_sidebar_options'>
          <div className={`menu_bar_${isopen ? "option" :"option"}`}>
      </div>
      <div  className={`sidebar_option_${isopen ? "hover" : 'closed'}`} onClick={()=>toggleTheme()}>
      {theme==="light"?
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M484-80q-84 0-157.5-32t-128-86.5Q144-253 112-326.5T80-484q0-146 93-257.5T410-880q-18 99 11 193.5T521-521q71 71 165.5 100T880-410q-26 144-138 237T484-80Zm0-80q88 0 163-44t118-121q-86-8-163-43.5T464-465q-61-61-97-138t-43-163q-77 43-120.5 118.5T160-484q0 135 94.5 229.5T484-160Zm-20-305Z"/></svg>
      :<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M440-760v-160h80v160h-80Zm266 110-55-55 112-115 56 57-113 113Zm54 210v-80h160v80H760ZM440-40v-160h80v160h-80ZM254-652 140-763l57-56 113 113-56 54Zm508 512L651-255l54-54 114 110-57 59ZM40-440v-80h160v80H40Zm157 300-56-57 112-112 29 27 29 28-114 114Zm283-100q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Zm0-80q66 0 113-47t47-113q0-66-47-113t-113-47q-66 0-113 47t-47 113q0 66 47 113t113 47Zm0-160Z"/></svg>}
      </div>
      <div  className={`sidebar_option_${isopen ? "hover" : 'closed'}`}>
      <svg onClick={()=>navigate("/classroom")} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill=""><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>
      {isopen ?
      <h4>Leave</h4>:null}
      </div>
      {isopen ? <div className='main_options_container'>
        <div className="menu_options_container">
          <div className="option_1"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M440-760v-160h80v160h-80Zm266 110-55-55 112-115 56 57-113 113Zm54 210v-80h160v80H760ZM440-40v-160h80v160h-80ZM254-652 140-763l57-56 113 113-56 54Zm508 512L651-255l54-54 114 110-57 59ZM40-440v-80h160v80H40Zm157 300-56-57 112-112 29 27 29 28-114 114Zm283-100q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Zm0-80q66 0 113-47t47-113q0-66-47-113t-113-47q-66 0-113 47t-47 113q0 66 47 113t113 47Zm0-160Z"/></svg></div>
          <div className="option_1"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80H240Zm0-80h480v-640h-80v280l-100-60-100 60v-280H240v640Zm0 0v-640 640Zm200-360 100-60 100 60-100-60-100 60Z"/></svg></div>
          <div className="option_1"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240ZM330-120 120-330v-300l210-210h300l210 210v300L630-120H330Zm34-80h232l164-164v-232L596-760H364L200-596v232l164 164Zm116-280Z"/></svg></div>
        </div>
        <div className="active_participants_list">
          <h3>Manvith</h3>
          <h3>Manvith</h3>
        </div>
      </div>
      :null
      }
      </div>
      <div className="popup_user_container" onClick={(e)=>{e.stopPropagation}}>
        <div className='Userpopup_container'>
        { userpopup?
        <div className="user_popup">
          <p>{userdata?.response?.name || 'Guest'}</p>
          <p>{userdata?.response?.email || "Not lgged in"}</p>
          <button
  onClick={() => {
    const roomLink = `${window.location.origin}/classroom/${id}`;
    navigator.clipboard.writeText(roomLink)
    .then(() => toast.success("Room link copied!"))
    .catch(() => toast.error("Failed to copy link"));}}>Share room</button>
        </div> 
        :null}
      <div className="classroom_id_sidebar_settings">
      <div  className={`sidebar_option_${isopen ? "hover" : 'closed'}`} onClick={(e) =>{e.stopPropagation();if (userdata?.response) {setuserpopup(!userpopup);} else {toast.info("Please log in first");}}}>
      <svg xmlns="http://www.w3.org/2000/svg"  style={{marginTop:"auto"}} height="24px" viewBox="0 -960 960 960" width="24px" fill='red'><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/></svg>
      {isopen ?
      <h4>User info</h4>:null}
      </div>
      </div>
      </div>
      </div>
      </div>
      <div className="navbar_and_chatroom_container">
      <div className="navbar_chatroom">
        <h3>{roomdetails.roomName}</h3>
        <h5>--{roomdetails._id}</h5>

      </div>
      <div className="chatroom_mainpage">
        <div className="chats_section_chatroom">
          {startchat ?
          <div className="chat_messages_container" ref={chatScroller}>
          {chatdata.map((item,index)=>
          <div className={`response_${item.userid === userId ? "myself" : "friend"}`}>
            <h5 style={{width:"max-content",color:"orange"}}>{item.user}</h5>
            <h4>{item.text}</h4>
            </div>
          )}
          </div>
        :null}
        {startchat ?
        null:   
        <div className='intro_image_chatroom'>
            <div className="logo_info_container_chatroom">
              {theme==="light"
              ?<img src="https://res.cloudinary.com/dvd8yytqv/image/upload/v1757096116/datatheme-light_jwoqec.png" alt="brand_logo" className="brand_logo" style={{filter:"invert(1)"}} />
            :<img src="https://res.cloudinary.com/dvd8yytqv/image/upload/v1757096116/datatheme-light_jwoqec.png" alt="brand_logo" className="brand_logo" />}
            <div className="name_and_contact_info">
            <h1>ThinkSpace</h1>
            <div className="contact_options_container">
            <div className="contact_options"><i className="fa-brands fa-instagram"></i></div>
            <div className="contact_options"><i className="fa-brands fa-telegram"></i></div>
            <div className="contact_options"><i className="fa-brands fa-facebook"></i></div>
            </div>
            </div>
            </div>
            </div>
          }
      <div className="input_bar_chatroom">
          <textarea className='input_message_chatroom' value={message} onClick={()=>{setstartchat(true)}} onChange={(e)=>setmessage(e.target.value)} ></textarea>
          <div className="buttons_container_input_bar">
            <button className='input_bar_buttons' onClick={()=>{handleSendMessage();setSend(true)}}>Send <svg style={{marginLeft:"5px"}} id={send ?`fly_send`:null} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill=""><path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/></svg></button>
          </div>
        </div>
      </div>
      </div>
    </div>
    </div>
)
}
export default Classroomid;

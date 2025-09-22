import React, { useEffect, useState, useRef } from 'react'
import "./Notespaceid.css"
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useTheme } from "../../Context/ThemeContext";
import { RingLoader } from "react-spinners";
import {Userid} from "../../Context/UserId"
const Notespaceid = () => {
    const { userId } = Userid();
    const {id} = useParams();
    const[loading,setLoading]=useState(true);
    const[material,setMaterial]=useState([]);
    const{theme,toggleTheme} = useTheme();
    const[connectAi,SetConnectAi]=useState(true);
    const[messages,setMessages]=useState([])
    const[input,setInput]=useState("")
    const[SendButton,setSendButton]=useState(false)
    const chatContainerRef = useRef(null);
    axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
    axios.defaults.withCredentials = true;
    
    useEffect(() => {
        if (SendButton) {
          const timer = setTimeout(() => setSendButton(false), 1000); // reset after animation duration
          return () => clearTimeout(timer);
        }
      }, [SendButton]);

    useEffect(()=>{
        axios.get(`/api/drive/pdf/${id}`)
        .then(res=>{
            setMaterial(res.data)
            setLoading(false)
        })
        .catch(err=>toast.error("Error fetching materials"));
    },[])

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;
    
        try {
          const res = await axios.post("/api/gemini/chat", {
            userid: userId,
            prompt: input,
        });
          setMessages(res.data.messages);
          setInput("");
        } catch (err) {
          console.error("Error sending message:", err);
        }
      };

  return (
    <div className="preview_page">
        <div className="preview_page_items_container">
            {loading ?
                 <div className="preview_pdf_loader">
                    <RingLoader
                    color="#008325"
                    size={80}/>
                      <h3 style={{marginTop:"20px",marginLeft:"30px"}}>Loading</h3>
                </div>
            :
            <div className="preview_pdf">
            {material.viewUrl ? 
                <iframe src={material.viewUrl.split("?")[0].replace("/view", "/preview")}frameBorder="0"></iframe> 
            :null}
            </div>}
            <div className="preview_chatbot" ref={chatContainerRef}>
                {connectAi ? <div className='Ai_background_logo'>
                    {theme==="light" ? <img src="https://res.cloudinary.com/dvd8yytqv/image/upload/v1757096116/datatheme-light_jwoqec.png" alt="brand_logo"  style={{filter:"invert(1)"}} /> :
                <img src="https://res.cloudinary.com/dvd8yytqv/image/upload/v1757096116/datatheme-light_jwoqec.png" alt="brand_logo"  />}
                    <h3>ThinkSpace</h3>
                </div> : (
                    <div className='chat_section'>
            {messages.map((message, index) => (
                <div key={index}>
                    {message.role === "user" && (
                        <h5 className='preview_ai_question'>{message.content}</h5>
                    )}
                    {message.role === "ai" && (
                        <div className="ai_logo_answer">
                            <div className="ai_logo_preview">
                            {theme==="light" ? <img src="https://res.cloudinary.com/dvd8yytqv/image/upload/v1757096116/datatheme-light_jwoqec.png" alt="brand_logo" className="ai_logo_image" style={{filter:"invert(1)"}} /> :
                            <img src="https://res.cloudinary.com/dvd8yytqv/image/upload/v1757096116/datatheme-light_jwoqec.png" alt="brand_logo" className="ai_logo_image_white" />}
                            </div>
                            <h5 className='preview_ai_answer'>{message.content}</h5>
                        </div>
                    )}
                </div>
            ))}
                </div>)}
                <div className="preview_chatbot_bottom_component">
                    <input type="text"  value={input} onClick={()=>{SetConnectAi(false)}}  onChange={(e)=>setInput(e.target.value)}/>
                    <button 
                        onClick={()=>{
                            sendMessage();
                            setSendButton(true);
                        }} 
                        className={`button-send ${SendButton ? "fly-rotate" : ""}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" >
                            <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Notespaceid

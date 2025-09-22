import React, { use, useState } from 'react'
import "./Homepage.css"
import { useNavigate } from "react-router-dom";
import { RingLoader } from "react-spinners";
import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;
const Homepage = () => {
    const[loading,setloading]=useState(true);
    const[loading2,setloading2]=useState(true);
    const navigate=useNavigate();
  return (
    <div className='Homepage'>
        <div className="homepage_welcome">
      <div className="homepage_headings_container">
        <h1>Share Ideas <br />Build Knowledge</h1>
        <p>Our platform is a modern, collaborative learning space where students can share notes, chat with peers, and get instant assistance from a built-in AI bot. Designed for seamless collaboration, it combines the convenience of note-taking with interactive discussions, making studying smarter, faster, and more engaging for everyone.</p>
        <div className="homepage_button_container">
            <button onClick={() =>{navigate("/classroom")}}>ROOM</button>
            <button onClick={() =>{navigate("/notespace")}}>NOTES</button>
        </div>
      </div>
      <div className="homepage_image_container">
        <div className="images_container">
            <div className="homepage_card_1">
                <div className="homepage_card_image_container">
                    {loading ?
                          <RingLoader
                          color="#008325"
                          size={80}/>:null}
                <img src="https://res.cloudinary.com/dvd8yytqv/image/upload/v1756455499/unnamed_v2muib.jpg" alt="wait" onLoad={()=>setloading(false)} />
                </div>
                <div className="homepage_card_text_container">
                    <h2>AI bot built for <br /> students</h2>
                </div>

            </div>
            <div className="homepage_card_2">
            <div className="homepage_card_image_container">
                {loading ?
                        <RingLoader
                        color="#008325"
                        size={80}/>:null}
                <img src="https://res.cloudinary.com/dvd8yytqv/image/upload/v1756455499/unnamed-1_o2h0l1.jpg" alt="wait" onLoad={()=>{setloading2(false)}} />
                </div>
                <div className="homepage_card_text_container">
                    <h2>Free platform to <br /> share notes and <br /> communicate</h2>
                </div>
            </div>
        </div>
      </div>
    </div>
    <div className="benefits_coloum_homepage">
        <div className="benefits_homepage_box">
            <div className="benefits_heading_main">
            <svg xmlns="http://www.w3.org/2000/svg" height="60px" viewBox="0 -960 960 960" width="60px" fill="#168136"><path d="M323-160q-11 0-20.5-5.5T288-181l-78-139h58l40 80h92v-40h-68l-40-80H188l-57-100q-2-5-3.5-10t-1.5-10q0-4 5-20l57-100h104l40-80h68v-40h-92l-40 80h-58l78-139q5-10 14.5-15.5T323-800h97q17 0 28.5 11.5T460-760v160h-60l-40 40h100v120h-88l-40-80h-92l-40 40h108l40 80h112v200q0 17-11.5 28.5T420-160h-97Zm237 0q-33 0-56.5-23.5T480-240q0-23 11-40.5t29-28.5v-342q-18-11-29-28.5T480-720q0-33 23.5-56.5T560-800q33 0 56.5 23.5T640-720q0 23-11 40.5T600-651v101l80-48q0-34 23.5-58t56.5-24q33 0 56.5 23.5T840-600q0 33-23.5 56.5T760-520q-11 0-20.5-2.5T721-530l-91 55 101 80q7-3 14-4t15-1q33 0 56.5 23.5T840-320q0 33-23.5 56.5T760-240q-37 0-60.5-28T681-332l-81-65v89q18 11 28.5 28.5T639-240q0 33-23 56.5T560-160Z"/></svg>
            <h2 style={{marginLeft:"15px"}}>Key Benefits of Our Project</h2>
            <h3 style={{color:"#202024",opacity:"60%",marginLeft:"15px"}}>ThinkSpace</h3>
            </div>
            <div className="advantages_side_heading">
                <div className="benefits_heading">
                <h2>Centralized Study and Chat Hub</h2>
                <p>All users can access notes, PDFs, images, and chat in one place, making learning and collaboration easier and faster.</p>
                </div>
                <div className="benefits_heading">
                <h2>Built-in Artifical Assistance</h2>
                <p>The integrated AI bot helps answer questions, provide explanations, and guide users, saving time and enhancing understanding</p>
                </div>
                <div className="benefits_heading">
                <h2>Open and Interactive Community</h2>
                <p>Users can join open rooms for study, discussion, and fun, encouraging peer-to-peer learning and social interaction.</p>
                </div>
            </div>
        </div>
    </div>
    <div className="homepage_advantages_section">
        <div className="homepage_advantage">
        <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#168136"><path d="M40-120v-60h880v60H40Zm100-120q-24 0-42-18t-18-42v-480q0-24 18-42t42-18h680q24 0 42 18t18 42v480q0 24-18 42t-42 18H140Zm0-60h680v-480H140v480Zm0 0v-480 480Z"/></svg>
        <h2>One Hub for All Questions</h2>
        <h3>Our platform brings all your doubts and questions into a single, easy-to-access hub. Whether it’s study material, notes, PDFs, or quick clarifications, you can find answers instantly. With the help of our AI assistant and an interactive community, learning has never been easier or more efficient.</h3>
        </div>
        <div className="homepage_advantage">
        <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#168136"><path d="M480-80q-140-35-230-162.5T160-522v-238l320-120 320 120v238q0 152-90 279.5T480-80Zm0-62q106-35 175.5-128.5T737-480H480v-335l-260 97v196q0 12 .5 20.5T223-480h257v338Z"/></svg>
        <h2>Your Data, Fully Secure</h2>
        <h3>We prioritize your privacy and security. All your notes, PDFs, and personal interactions are protected with robust measures to ensure that your data remains safe. Our platform provides a secure environment where you can collaborate, share, and learn with complete peace of mind</h3>
        </div>
        <div className="homepage_advantage">
        <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#168136"><path d="M337.94-160Q215-160 129-246.06t-86-209Q43-578 129.04-664T338-750q53.08 0 100.04 17Q485-716 523-685l46-46 42 42-46 46q32 38 50 86t18 102q0 122.92-86.06 208.96t-209 86.04ZM792-160 663-289l42-42 57 57v-526h60v525l56-56 42 42-128 129ZM246-820v-60h184v60H246Zm91.81 600q98.19 0 166.69-68.31t68.5-166.5q0-98.19-68.31-166.69T338.19-690Q240-690 171.5-621.69T103-455.19q0 98.19 68.31 166.69t166.5 68.5ZM308-428h60v-183h-60v183Zm30-27Z"/></svg>
        <h2>Save Time, Learn Faster</h2>
            <h3>Our platform streamlines learning by bringing notes, PDFs, chat, and AI assistance all in one place. You no longer have to search across multiple sources—everything you need is instantly accessible, helping you focus on learning and save valuable time.</h3>
        </div>
    </div>
    </div>
  )
}

export default Homepage

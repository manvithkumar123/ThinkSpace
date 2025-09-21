import React, { useEffect, useState,useContext } from 'react'
import "./Classroom.css"
import axios from 'axios';
import { toast } from "react-toastify";
import { Vortex } from 'react-loader-spinner'
import { isAdmincontext } from '../../Context/isAdmin';
import { useNavigate } from "react-router-dom";


const Classroom = () => {
  const [data,SetData]=useState([]);
  const [loader,setLoader]=useState(true)
  const navigate=useNavigate();
  const [newroom,setNewroom]=useState(false)
  const [roomname,setRoomName]=useState('')
  const [roominfo,setRoominfo]=useState('')
  const { user } = useContext(isAdmincontext);
  const handleDeleteRoom = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
  
    try {
      await axios.post(`/api/room/delete/${id}`, { withCredentials: true });
      toast.success("Room deleted successfully");
      SetData(prev => prev.filter(room => room._id !== id));
    } catch (err) {
      console.log(err);
      toast.error("Error deleting room");
    }
  };
  const handleNewRoom= async(e)=>{
    e.preventDefault();
    if (!roomname || !roominfo) {
      return;
    }
    try{
    const res = await axios.post("/api/room/createroom",{roomName:roomname,information:roominfo},{withCredentials:true})
    toast.success(res.data.response || "Room created successfully");
    setRoomName("");
    setRoominfo("");
    const data = await axios.get("/api/room/allrooms");
    SetData(data.data); 
    }
    catch{
      toast.error("Error creating room")
    }
  }
  useEffect(() => {
    axios.get("/api/room/allrooms")
      .then((res) => {
        SetData(res.data);
        setLoader(false);
      })
      .catch((err) => {
        toast.error("Error fetching rooms")
        console.log(err)
      });
  }, []);
   useEffect(() => {
      if (newroom) {
        document.body.style.overflow = "hidden"; 
      } else {
        document.body.style.overflow = "auto"; 
      }
      return () => {
        document.body.style.overflow = "auto";
      };
    }, [newroom]);
  return (
    <div className="classroom_page">
      {newroom?
      <div className="create_room_admin_page">
        <div className="new_room_box" onClick={handleNewRoom}>
        <svg onClick={()=>{setNewroom(false)}} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
          <h5 style={{color:"red"}}>"Only administrators can create new rooms, <br /> as changes may affect all users' views."</h5>
          <label><h4>Room Name</h4><input type="text" placeholder='Room Name' autoComplete='new-room' onChange={(e)=>setRoomName(e.target.value)}/></label>
          <label><h4>Room Information</h4><input type="text" placeholder='Room Information' autoComplete='new-information' onChange={(e)=>setRoominfo(e.target.value)}/></label>
          <button>Create Room</button>
        </div>
      </div>
      :null}
      <div className="classroom_section">
        {user?.role === "admin" ? 
        <div className="create_new_room_admin">
          <button onClick={()=>setNewroom(!newroom)}>Create new room<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill=""><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg></button>
        </div>
        :null}
  {loader ? (
    <div className="classrooms_box_loader">
      <Vortex
         visible={true}
         height="80"
         width="80"
         ariaLabel="vortex-loading"
         wrapperStyle={{}}
         wrapperClass="vortex-wrapper"
         colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
         />
         <h3>Loading...</h3>
    </div>
  ) : data.length === 0 ? (
    <h2>No rooms available</h2>
  ) : (
    data.map((room) => (
      <div className="classrooms_box" key={room._id}>
        <h2>{room.roomName}</h2>
        <p>{room.information}</p>
        <div className="button_container_add_delete">
        <button onClick={() => navigate(`/classroom/room/${room._id}`)}>JOIN</button>
        {user?.role === "admin" ? (
          <button style={{backgroundColor:"#F44336"}} onClick={() => handleDeleteRoom(room._id)}> delete</button>
        ) : (
          null
        )}
        </div>
      </div>
    ))
  )}
</div>
        <div className="rules_section">
        <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#168136"><path d="M160-120v-60h480v60H160Zm222-212L160-554l70-72 224 222-72 72Zm254-254L414-810l72-70 222 222-72 72Zm202 426L302-696l42-42 536 536-42 42Z"/></svg>
        <h2>RULES TO FOLLOW</h2>
        <h4>
             1)Minimum age to join is 13+ years. <br />
             2)Use respectful language – no harmful, abusive, or offensive words.<br />
             3)Do not share unwanted, misleading, or fake information.<br />
             4)No nudity, sexual, or violent content is allowed.<br />
             5)Respect others’ privacy – do not share personal details without consent.
        </h4>
        </div>
        </div>
  )
}

export default Classroom

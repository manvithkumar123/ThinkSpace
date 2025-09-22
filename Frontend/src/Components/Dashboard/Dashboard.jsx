import { Spin } from "antd";
import "./dashboard.css";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { isAdmincontext } from '../../Context/isAdmin';
import { useNavigate, useParams } from "react-router-dom";
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;

const Dashboard = () => {
  const navigate=useNavigate();
  const {id}=useParams();
  const [loading, setLoading] = useState(true);
  const [querylist,setQuerylist]=useState([]);
  const {user}=useContext(isAdmincontext)
  const [openquery,setOpenquery]=useState(false);
  const [openquerydata,setOpenquerydata]=useState(false);
  const [data, setData] = useState(null);
  const [queryname,setQueryname]=useState("");
  const [querymail,setQuerymail]=useState("");
  const [query,setQuery]=useState("");
  const [selectedQueryId, setSelectedQueryId] = useState(null);
  const handleQuery=async (e)=>{
    e.preventDefault();
    await axios.post("/api/query/sendquery",{Username:queryname,Mail:querymail,Query:query})
    try{
      toast.success("Query sent successfully");
      setQueryname("");
      setQuerymail("");
      setQuery("");
    }
    catch(err){
      toast.error("Error in sending query. Please try again");
    }
  }
  const handlelogout = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/user/logout", {}, { withCredentials: true }); // important
      toast.success("Logged out successfully");
      navigate("/"); // 
    } catch (err) {
      toast.error("Something went wrong. Please try again");
    }
  };
  useEffect(()=>{
    const fetchQueries=async()=>{
      try{
        const res=await axios.get("/api/query/getqueries");
        setQuerylist(res.data);
      }
      catch(err){
        toast.error("Error in fetching queries");
      }
    }
    if(user?.role==="admin"){
      fetchQueries();
    }
  })
  useEffect(() => {
    if (openquery) {
      document.body.style.overflow = "hidden"; 
    } else {
      document.body.style.overflow = "auto"; 
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openquery]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/user/loggeduser");
        setData(res.data);
      } catch (error) {
        toast.error("Error fetching data", { toastId: "fetchError" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (selectedQueryId) {
      axios.get(`/api/query/${selectedQueryId}`)
        .then(res => setOpenquerydata(res.data))
        .catch(err => console.error(err));
    }
  }, [selectedQueryId]);
  const handledelete = async (id)=>{
    const res =await axios.post(`/api/query/delete/${id}`);
    try{
      toast.success(res.data.response)
    }
    catch(err){
      toast.error(err.response?.data.response)
    }
  }
  const handledeleteall=async(e)=>{
    const res =axios.post("/api/query/deleteall");
    try{
      toast.success(res.data.response)
    }
    catch(err){
      toast.error(err.response?.data.response)
    }
  }
  return (
    <div className="dashboard_page">
    {openquery ?
      <div className="openquery_page">
        <div className="openquery_container">
          <h4><span style={{opacity:'40%',marginRight:"10px"}}>Username:</span>{openquerydata.Username}</h4>
          <h4><span style={{opacity:'40%',marginRight:"10px"}}>Mailid:</span>{openquerydata.Mail}</h4>
          <h3><span style={{opacity:'40%',marginRight:"10px"}}>Query:</span><br />{openquerydata.Query}</h3>
          <button onClick={()=>{setOpenquery(false)}}>Done</button>
        </div>
      </div>
      :null}
          <div className="dashboard_section">
            <div className="first_coloum_userinfo">
              <div className="user_section_dashboard">
                <img
                  src="https://res.cloudinary.com/dvd8yytqv/image/upload/v1757777224/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait-removebg-preview_mfbx9x.png"
                  alt=""
                />
              </div>
              <div className="user_information_dashboard">
                <h2>{data?.response?.name}</h2>
                <h2>{data?.response?.email}</h2>
                <button onClick={handlelogout}>logout</button>
              </div>
            </div>
          </div>
      {user?.role === "admin" ? (
        <div className="feedback_section">
          <div className="options_list">
            <button onClick={handledeleteall}>
              Delete all
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
              </svg>
            </button>
          </div>
          {querylist
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((item) => (
              <div
                className="querylist"
                key={item._id}
                onClick={() => {
                  setOpenquery(true);
                  setSelectedQueryId(item._id);
                }}
              >
                <div className="query_info_container">
                  <h2 id="query_username">{item.Username}</h2>
                  <h2 id="query_mail">{item.Mail}</h2>
                </div>
                <div className="time_stamp_container">
                  {item.createdAt.split("T")[0]} <br />
                  {item.createdAt.split("T")[1].split(".")[0]}
                </div>
                <button onClick={(e) =>{ e.stopPropagation();handledelete(item._id)}}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                  </svg>
                </button>
              </div>
            ))}
        </div>
      ) : (
        <form onSubmit={handleQuery}>
          <div className="information_section">
            <label>
              <h3>Name</h3>
              <input
                type="text"
                placeholder="Your name"
                value={queryname}
                onChange={(e) => setQueryname(e.target.value)}
              />
            </label>
            <label>
              <h3>Mailid</h3>
              <input
                type="text"
                placeholder="Your contact mail id or phone number"
                value={querymail}
                onChange={(e) => setQuerymail(e.target.value)}
              />
            </label>
            <label>
              <h3>Query</h3>
              <textarea
                id="query_id"
                type="text"
                placeholder="Your query or issue"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <button>Submit</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Dashboard;
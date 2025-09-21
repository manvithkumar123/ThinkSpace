import {React,useContext,useEffect,useState} from 'react';
import "./Notespace.css";
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { Vortex,Hourglass } from 'react-loader-spinner'
import { isAdmincontext } from '../../Context/isAdmin';


const Notespace = () => {
    const[material,setMaterial]=useState([]);
    const [uploading,setuploading]=useState(false);
    const[loading,setLoading]=useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const[imgloading,imgsetLoading]=useState(true);
    const[openupload,setopenUpload]=useState(false);
    const [selectedBranchFilter, setSelectedBranchFilter] = useState("")
    const [selectedSemesterFilter, setselectedSemesterFilter] = useState("")
    const [selectedSubjectFilter, setSelectedSubjectFilter] = useState("");
    const {user}= useContext(isAdmincontext);
    const branches = ["CSE","AI/ML","CSW","DS","IT","EEE","ECE","IOT","OTHER"];
    const semester = ["1-1","1-2","1-3","1-4","2-1","2-2","2-3","2-4","3-1","3-2","3-3","3-4","4-1","4-2","4-3","4-4"];
    const subject = ["Coding related", "Theory related", "Practical related"];
      useEffect(() => {
        if (openupload) {
          document.body.style.overflow = "hidden"; 
        } else {
          document.body.style.overflow = "auto"; 
        }
        return () => {
          document.body.style.overflow = "auto";
        };
      }, [openupload]);
      const handleupload = async (e) => {
        e.preventDefault(); // prevent page reload
      
        if (!user) {
          toast.error("Please login first");
          navigate("/login");
          setuploading(false);
          return;
        }
      
        if (!selectedFile || !selectedBranch || !selectedSemester || !selectedSubject) {
          toast.error("Please fill all fields and select a file");
          setuploading(false);
          return;
        }
      
        try {
          const formData = new FormData();
          formData.append("Branch", selectedBranch);
          formData.append("Semester", selectedSemester);
          formData.append("Subject", selectedSubject);
          formData.append("file", selectedFile);
      
          const res = await axios.post("/api/drive/upload", formData, {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
      
          toast.success(res.data.response);
          setuploading(false);
      
          // Optionally reset form after successful upload
          setSelectedFile(null);
          setSelectedBranch("");
          setSelectedSemester("");
          setSelectedSubject("");
          setopenUpload(false);
      
          // Refresh materials list
          const updatedMaterials = await axios.get("/api/drive/materials");
          setMaterial(updatedMaterials.data);
        } catch (err) {
          console.log(err);
        }
      };
    const navigate=useNavigate();
    useEffect(()=>{
        axios.get("/api/drive/materials")
        .then(res=>{
            setMaterial(res.data)
            setLoading(false)
        })
        .catch(err=>toast.error("Error fetching materials"));
        setLoading(false)
    },[])
    const handledelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this Material?")) return;
        try {
            await axios.post(`/api/drive/delete/${id}`);
            toast.success("Material deleted successfully");
            setMaterial(prev => prev.filter(item => item._id !== id));
        } catch (err) {
            toast.error("Error deleting material");
            console.log(err);
        }
    };
  return (
    <div className="note_page">
        {openupload ? 
        <div className="upload_page">
            <div className="upload_container">
            <svg xmlns="http://www.w3.org/2000/svg" id="close_button" onClick={()=>{setopenUpload(false)}} height="24px" viewBox="0 -960 960 960" width="24px" fill=""><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            <form onSubmit={handleupload}>
            <input type="file" id="input_file" placeholder="choose file or drag and drop" onChange={(e) => setSelectedFile(e.target.files[0])} />
            <label>Branch
              <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
                <option value="">Select Branch</option>
                {branches.map(item => ( 
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              </label>
              <label >Semester
              <select  value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
                <option value="" name="Semester">Select Semester</option>
                {semester.map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              </label>
              <label  >Subject Type
              <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} >
                <option value="">Select type</option>
                {subject.map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              </label>
              <button id="upload_submit" onClick={()=>setuploading(true)}>Submit</button>
              {uploading?
              <div className="loading_uploading">
                <Hourglass
                  visible={true}
                  height="40"
                  width="40"
                  ariaLabel="hourglass-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                  colors={['#306cce', '#72a1ed']}
                  />
                 <h3>Uploading</h3>
                 </div>
              :null}
              </form>
            </div>
        </div>:null}
        <div className="filter_space">
        <div  className="filter_coloum">
            <h2>Filter</h2>
            <h3>Branch</h3>
            <div className="branch_checkpoints">
                {branches.map((item, index) => (
                  <label key={index}>
                    <input
                      type="checkbox"
                      checked={selectedBranchFilter === item}
                      onChange={() =>
                        setSelectedBranchFilter(selectedBranchFilter === item ? "" : item)
                      }
                    />
                    {item}
                  </label>
                ))}
            </div>
            <h3>Semester</h3>
            <div className="filter_semester_flex">
            <div className="branch_checkpoints_semester">
            {semester.map((item,index) =>(
            <label key={index}>
              <input
                type="checkbox"
                checked={selectedSemesterFilter === item}
                onChange={() =>
                  setselectedSemesterFilter(selectedSemesterFilter === item ? "" : item)
                }
              />
              {item}
            </label>
            ))}
            </div>
            </div>
            <h3 id="subject_container">Subject</h3>
            <div className="branch_checkpoints" id="subject_container">
            {subject.map((item,index)=>(
            <label key={index}>
              <input
                type="checkbox"
                checked={selectedSubjectFilter === item}
                onChange={() =>
                  setSelectedSubjectFilter(selectedSubjectFilter === item ? "" : item)
                }
              />
              {item}
            </label>
            ))}
            </div>
        <button id="upload_button" onClick={()=>setopenUpload(true)}>UPLOAD</button>
        </div>
        </div>
        <div className="notes_container_coloum">
            <div className="notes_container">
                {loading ? 
                    (Array(5).fill(0).map((_, index) => (
                        <div className="notes_uploaded_loader" key={index}>
                         <Vortex
                            visible={true}
                            height="80"
                            width="80"
                            ariaLabel="vortex-loading"
                            wrapperStyle={{}}
                            wrapperClass="vortex-wrapper"
                            colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
                            />
                            <h3>Loading</h3>
                        </div>
                    )))
                    : material.length===0 ?
                    (
                       <h2>No materials uploaded yet</h2>
                    )
                    :(
                    material
                    .slice()
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .filter(item =>
                      (!selectedBranchFilter || item.Branch === selectedBranchFilter) &&
                      (!selectedSemesterFilter || item.Semester === selectedSemesterFilter) &&
                      (!selectedSubjectFilter || item.Subject === selectedSubjectFilter)
                    )
                    .map((item) => (
                      <div className="notes_uploaded" onClick={()=>{navigate(`/notespace/${item._id}`)}} key={item._id}>
                          <div className="image_text_container">
                              <div className="image_button_container">
                          <div className="text_notes_uploded">
                          <label><h4>Subject Name:</h4> <p>{item.Subject}</p></label> 
                          <label><h4>Branch:</h4> <p>{item.Branch}</p> </label>
                          <label><h4>Semester:</h4> <p>{item.Semester}</p> </label>
                          <label><h4>Uploaded By:</h4> <p>{item.UploadedBy}</p> </label>
                          </div>
                          <div className="button_container_uploaded_notes">
                              {user?.role==="admin" ?
                              <button onClick={(e)=>{e.stopPropagation();handledelete(item._id);}}>Delete <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill=""><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>
                              :<button onClick={(e)=>{ e.stopPropagation() ;window.location.href = item.downloadUrl}} >Dowload<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" ><path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z"/></svg></button>
                              }
                              
                              <button>View <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill=""><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/></svg></button>
                          </div>
                          </div>
                          <div className="notes_img_container">
                              {imgloading && (
                                  <div className="notes_img_loader">
                                      <Vortex
                                          visible={true}
                                          height="80"
                                          width="80"
                                          ariaLabel="vortex-loading"
                                          wrapperStyle={{}}
                                          wrapperClass="vortex-wrapper"
                                          colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
                                      />
                                      <h3>Loading</h3>
                                  </div>
                              )}
                              <img
                                  src="https://www.pngall.com/wp-content/uploads/12/Google-Drive-PNG-Photos-300x225.png"
                                  alt=""
                                  onLoad={() => imgsetLoading(false)}
                                  style={{ display: imgloading ? 'none' : 'block' }}
                              />
                          </div>
                          </div>
                      </div>
                ))
                )}
            </div>
        </div>
    </div>

  )
}

export default Notespace;

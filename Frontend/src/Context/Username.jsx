import {React,useState,useContext,useEffect, createContext, Children} from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';

const userNameContext=createContext();

export const UserNameprovider=({children})=>{
    const [username,setUsername]=useState("")

    useEffect(()=>{
        const fetchusername=async ()=>{
        try{
            const res = await axios.get("/api/user/loggeduser",{ withCredentials: true })
            setUsername(res.data.response.name);
        }catch(error){
            console.log("error")
        }
    }
    fetchusername();
    },[]);
    return (
        <userNameContext.Provider value={{ username, setUsername }}>
            {children}
        </userNameContext.Provider>
    );
}

export const Username= ()=>useContext(userNameContext)

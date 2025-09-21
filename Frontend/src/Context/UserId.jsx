import axios from "axios";
import { createContext, useState, useEffect, useContext } from "react";

const UserIdContext = createContext();

export const UserIdProvider = ({ children }) => {
  const [userId, setUserId] = useState();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await axios.get("/api/user/loggeduser", { withCredentials: true });
        setUserId(res.data.response._id);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserId();
  }, []);

  return (
    <UserIdContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserIdContext.Provider>
  );
};
export const Userid=()=>useContext(UserIdContext);
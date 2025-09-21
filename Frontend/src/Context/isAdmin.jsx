import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const isAdmincontext = createContext();

export const IsAdminProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/user/loggeduser", { withCredentials: true });
        setUser(res.data.response);
      } catch (err) {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <isAdmincontext.Provider value={{ user }}>
      {children}
    </isAdmincontext.Provider>
  );
};
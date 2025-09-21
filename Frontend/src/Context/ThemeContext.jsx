import { useContext,createContext,useState,useEffect } from "react";

const ThemeContext=createContext();

export const Themeprovider=({children})=>{
    const [theme, settheme] = useState("dark");
    useEffect(()=>{
        document.documentElement.setAttribute("data-theme",theme)
        localStorage.setItem("theme",theme)
    },[theme])
    const toggleTheme=()=>settheme((prev)=>(prev==="dark"?"light":"dark"))

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
          {children}
        </ThemeContext.Provider>
    )
}
export const useTheme = () => useContext(ThemeContext);
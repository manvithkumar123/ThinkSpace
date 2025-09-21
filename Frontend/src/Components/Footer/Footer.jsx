import React from 'react'
import "./Footer.css"
import { useTheme } from "../../Context/ThemeContext";

const Footer = () => {
    const{theme,toggleTheme} = useTheme();
  return (
    <div className='footerpage'>
        <div className="followus_context">
        <h3>Follow Us</h3>
        <div className="icons_container">
        <div className="icon_container_box">
        <i className="fa-brands fa-instagram"></i>
        </div>
        <div className="icon_container_box">
        <i className="fa-brands fa-square-facebook"></i>
        </div>
        <div className="icon_container_box">
        <i className="fa-brands fa-whatsapp"></i>
        </div>
        <div className="icon_container_box">
        <i className="fa-brands fa-telegram"></i>
        </div>
        <div className="icon_container_box">
        <i className="fa-solid fa-envelope"></i>
        </div>
        </div>
        </div>
        <div className="footer_line"></div>
        <div className="footer_info_img_container">
        <div className="footer_logo_image">
        {theme==="light" ? <img src="./datatheme-light.png" alt="brand_logo" className="footer_logo_image" style={{filter:"invert(1)"}} /> :
                <img src="./datatheme-light.png" alt="brand_logo" className="brand_logo" />}
            <h2>ThinkSpace</h2>
        </div>
        <div className="footer_navigate_info_container">
        <div className="footer_navigate_links">
             <h3>HOME</h3>
             <h3>CLASSROOM</h3>
             <h3>NOTESPACE</h3>
             <h3>LOGIN</h3>
        </div>
        <div className="footer_info_container">
          <p>ThinkSpace is a platform created by Manvith Kumar for sharing notes and connecting with new people. <br />Users can join different rooms based on their interests—Fun, Studies, Sports, or Movies—to chat, collaborate, and have fun. <br /> If you have any suggestions or face any issues with the website, feel free to contact us at m6783321@gmail.com.</p>
        </div>
        </div>

    </div>
    </div>
  )
}

export default Footer

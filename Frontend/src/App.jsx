import React from 'react'
import Navbar from './Components/Navbar/Navbar'
import { Themeprovider } from './Context/ThemeContext'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Homepage from './Components/Homepage/Homepage';
import Footer from './Components/Footer/Footer';
import Classroom from './Components/Classroom/Classroom';
import Classroomid from './Components/Classroomid/Classroomid';
import Notespace from './Components/Notespace/Notespace';
import Notespaceid from './Components/Notespaceid/Notespaceid';
import Login from './Components/Login/Login';
import RedirectIfLoggedIn from './Context/RedirectIfLoggedIn';
import Dashboard from './Components/Dashboard/Dashboard';
import { IsAdminProvider } from './Context/isAdmin';
import { UserIdProvider } from './Context/UserId';
import { UserNameprovider } from './Context/Username';


function AppContent() {
  const location = useLocation();
  const hideLayout = location.pathname.startsWith("/classroom/room");

  return (
    <>
    <UserIdProvider>
    <IsAdminProvider>
      <UserNameprovider>
      {!hideLayout && <Navbar />}
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path="/classroom" element={<Classroom />} />
        <Route path="/classroom/room/:id" element={<Classroomid />} />
        <Route path="/Notespace" element={<Notespace/>}/>
        <Route path="/Notespace/:id" element={<Notespaceid/>}/>
        <Route path="/Dashboard" element={<Dashboard/>}/>
        <Route path="/Login" element={<RedirectIfLoggedIn><Login/></RedirectIfLoggedIn>}/>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} limit={1} />
      {!hideLayout && <Footer />}
      </UserNameprovider>
    </IsAdminProvider>
    </UserIdProvider>
    </>
  );
}

const App = () => {
  return (
    <Themeprovider>
      <Router>
        <AppContent />
      </Router>
    </Themeprovider>
  );
}

export default App;
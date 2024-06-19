// import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import User from "../pages/patient/User";
import History from "../pages/patient/History";
import { useLocation } from "react-router-dom";

const Patient = () => {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const [isAppointmentActive, setIsAppointmentActive] = useState(false);
  const [isHistoryActive, setIsHistoryActive] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
      }
    }
    setIsAppointmentActive(location.pathname === "/appointment");
    setIsHistoryActive(location.pathname === "/history");
  }, [location, navigate]);


  return (
   <div className="flex flex-col">
      <Navbar userData={userData}/>
      {/* Tampilkan <User /> hanya jika path saat ini adalah '/appointment' */}
      {isAppointmentActive && <User userData={userData} />}
      {/* Tampilkan <History /> hanya jika path saat ini adalah '/history' */}
      {isHistoryActive && <History userData={userData} />}
    </div>
  )
}

export default Patient
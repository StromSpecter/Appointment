import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BiSolidDashboard, BiSolidUser } from "react-icons/bi";
import { ImProfile } from "react-icons/im";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import  Evergeen  from "../assets/Evergeen.svg";

const Sidebar = () => {
  const location = useLocation();
  const [sidebarActive, setSidebarActive] = useState(false);

  const sidebarToggle = () => {
    setSidebarActive(!sidebarActive);
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <div
      className={`flex flex-col ${
        sidebarActive ? "w-20" : "w-64"
      } h-screen bg-white transition-all duration-300`}
    >
      {/* Logo */}
      <div className="flex items-center justify-center h-32 p-12">
        <img src={Evergeen} alt="logo" />
      </div>
      <BsArrowLeftCircleFill
        className={`fixed text-2xl top-24 text-violet-500 transition-all duration-300 ${
          sidebarActive ? "left-16" : "left-60"
        } transform ${sidebarActive ? "rotate-180" : ""}`}
        onClick={sidebarToggle}
      />
      {/* Links */}
      <div className="flex flex-col flex-grow px-4 gap-4">
        <Link
          to="/"
          className={`flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-100 ${
            isActiveLink("/") && "text-violet-500 bg-violet-100"
          }`}
        >
          <BiSolidDashboard />
          <p className={sidebarActive ? "hidden" : ""}>Dashboard</p>
        </Link>
        <Link
          to="/users"
          className={`flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-100 ${
            isActiveLink("/users") && "text-violet-500 bg-violet-100"
          }`}
        >
          <BiSolidUser />
          <p className={sidebarActive ? "hidden" : ""}>Users</p>
        </Link>
        <Link
          to="/appointments"
          className={`flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-100 ${
            isActiveLink("/appointments") && "text-violet-500 bg-violet-100"
          }`}
        >
          <ImProfile />
          <p className={sidebarActive ? "hidden" : ""}>Appointments</p>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;

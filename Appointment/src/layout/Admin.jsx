import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const Admin = () => {

  return (
    <div className="flex flex-row w-full h-screen bg-slate-200">
      {/* Sidebar */}
      <div className="relative top-0 left-0">
        <Sidebar />
      </div>
      <div className="flex flex-col w-full h-full overflow-y-auto">
        {/* Header */}
        <Header />
        {/* Main Content */}
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;

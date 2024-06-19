import { Route, Routes } from "react-router-dom";
import Admin from "./layout/Admin";
import Dashboard from "./pages/admin/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Appointments from "./pages/admin/Appointments";
import Users from "./pages/admin/Users";
// import User from "./pages/patient/User";
// import History from "./pages/patient/History";
import Patient from "./layout/Patient";


const App = () => {

  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Routes */}
        <Route path="/appointment" element={<Patient />}>
        </Route>

        <Route path="/history" element={<Patient />} />

        {/* Admin Routes */}
        <Route path="/" element={<Admin />}>
          <Route index element={<Dashboard />} />
          <Route path="/users" element={<Users/>} />
          <Route path="/appointments" element={<Appointments />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;

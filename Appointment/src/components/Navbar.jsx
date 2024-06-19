import { useState, useEffect } from "react";
import { BsCaretDown } from "react-icons/bs";
import iconProfil from "../assets/icon_user.png";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types"; // Import PropTypes
import Evergeen from "../assets/Evergeen.svg";


const Navbar = ({ userData }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Cek status login dari localStorage
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    // Jika tidak ada status login, redirect ke halaman login
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      // Menghapus status login dari localStorage
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userData");
      // Navigasi ke halaman login
      navigate("/login");
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  return (
   <nav className="flex flex-row items-center justify-between bg-violet-500 p-4">
      <div className="text-white font-bold text-xl w-20">
        <img src={Evergeen} alt="logo" />
      </div>
      <div className="flex flex-row gap-4 items-center">
        <ul className="flex flex-row gap-4">
          <li>
            <Link to="/appointment" className="text-white hover:text-gray-300">
              Appointment
            </Link>
          </li>
          <li>
            <Link to="/history" className="text-white hover:text-gray-300">
              History
            </Link>
          </li>
        </ul>
        {/* profile */}
        <div className="flex flex-row gap-4 items-center">
          <div className="relative">
            <img
              src={iconProfil}
              alt="Profile"
              className="w-12 h-12 rounded-full cursor-pointer"
              onClick={toggleDropdown}
            />
          </div>
          <div
            className="flex flex-col cursor-pointer"
            onClick={toggleDropdown}
          >
            {/* title */}
            <p className="text-md text-white">{userData?.fullName}</p>
          </div>
          {/* dropdown */}
          <div className="relative">
            <BsCaretDown
              className=" text-white cursor-pointer"
              onClick={toggleDropdown}
            />
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
                <ul className="py-1">
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </a>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  userData: PropTypes.shape({
    fullName: PropTypes.string.isRequired,
    // Tambahkan properti lain yang sesuai kebutuhan
  }),
};

export default Navbar;

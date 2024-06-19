import { useState, useEffect } from "react";
import { PiBell, PiChat } from "react-icons/pi";
import { BsCaretDown } from "react-icons/bs";
import iconProfil from "../assets/icon_user.png";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    <div className="flex flex-row items-center justify-between px-5 py-10 w-full bg-white">
      {/* searchbar */}
      <input
        type="text"
        placeholder="Search"
        className="h-12 w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
      />
      <div className="flex flex-row gap-5 items-center relative">
        {/* Message Icon */}
        <div className="flex w-8 h-8 bg-gray-200 rounded-full items-center justify-center">
          <PiChat />
        </div>
        {/* Notification Icon */}
        <div className="flex w-8 h-8 bg-gray-200 rounded-full items-center justify-center">
          <PiBell />
        </div>
        {/* Profile Icon */}
        <div className="relative">
          <img
            src={iconProfil}
            alt="Profile"
            className="w-12 h-12 rounded-full cursor-pointer"
            onClick={toggleDropdown}
          />
        </div>
        <div className="flex flex-col cursor-pointer" onClick={toggleDropdown}>
          {/* title */}
          <p className="text-sm font-light">Admin</p>
        </div>
        <BsCaretDown
          className={`transform cursor-pointer ${
            isDropdownOpen && "rotate-180"
          }`}
          onClick={toggleDropdown}
        />
        {isDropdownOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-md overflow-hidden">
            <ul>
              <li className="px-6 py-3 hover:bg-gray-100 cursor-pointer">
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </a>
              </li>
              <li className="px-6 py-3 hover:bg-gray-100 cursor-pointer ">
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
  );
};

export default Header;

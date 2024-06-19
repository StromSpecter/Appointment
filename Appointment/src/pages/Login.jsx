import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../cons";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        // Simpan status login ke localStorage
        localStorage.setItem("isLoggedIn", true);
        // Simpan data pengguna ke localStorage jika tersedia
        if (data.user) {
          localStorage.setItem("userData", JSON.stringify(data.user));
        }
        // Cek apakah pengguna yang berhasil login adalah admin
        if (data.user && data.user.role === "admin") {
          // Jika email pengguna adalah admin, alihkan ke halaman admin
          navigate("/");
        } else {
          // Jika bukan admin, alihkan ke halaman user
          navigate("/appointment");
        }
        setError(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-row h-screen">
      {/* Bagian kiri */}
      <div className="flex flex-col bg-violet-500 text-white h-full w-full items-center justify-center">
        <h1 className="text-3xl font-bold">Welcome Back!</h1>
        <p className="text-gray-200 mt-2">Please login to your account.</p>
      </div>

      {/* Bagian kanan */}
      <div className="flex flex-col bg-white h-full w-full items-center justify-center">
        {/* Form login */}
        <form className="w-1/2 mx-auto" onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold mb-4">Login</h1>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email Address"
              required
            />
          </div>
          <div className="mb-0">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="******************"
              required
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <div className="flex items-center justify-between my-3">
            <button
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Login
            </button>
          </div>
          <p>
            Dont have an account? Sign up{" "}
            <Link to="/register">
              <span className="text-blue-500">here</span>
            </Link>
          </p>

          <hr />
        </form>
      </div>
    </div>
  );
};

export default Login;

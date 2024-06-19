import { useState, useEffect } from "react";
import { PiPlus } from "react-icons/pi";
import { API_URL } from "../../../cons";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [newDoctorData, setNewDoctorData] = useState({
    name: "",
    specialty: "",
    image: "",
  });
  const [showAddDoctorPopup, setShowAddDoctorPopup] = useState(false);
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState("");

  const loadImage = (e) => {
    const image = e.target.files[0];
    setFile(image);
    setPreview(URL.createObjectURL(image));
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(`${API_URL}/get-user`);
        if (response.ok) {
          const data = await response.json();
          setPatients(data);
        } else {
          console.error("Failed to fetch patients data");
        }
      } catch (error) {
        console.error("Error fetching patients data:", error);
      }
    };

    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${API_URL}/doctors`);
        if (response.ok) {
          const data = await response.json();
          setDoctors(data);
        } else {
          console.error("Failed to fetch doctors data");
        }
      } catch (error) {
        console.error("Error fetching doctors data:", error);
      }
    };

    fetchPatients();
    fetchDoctors();
  }, []);

  const handlePopupClose = () => {
    setShowAddDoctorPopup(false);
    // Reset form data dokter
    setNewDoctorData({
      name: "",
      specialty: "",
      image: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDoctorData({
      ...newDoctorData,
      [name]: value,
    });
  };

  const handleAddDoctor = async () => {
    const formData = new FormData();
    formData.append("name", newDoctorData.name);
    formData.append("specialty", newDoctorData.specialty);
    formData.append("image", file);

    try {
      const response = await fetch("${API_URL}/doctors", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        // Perbarui state doctors dengan data baru
        setDoctors((prevDoctors) => [...prevDoctors, data]);
        setNewDoctorData({ name: "", specialty: "" });
        setFile("");
        setPreview("");
      } else {
        console.error("Failed to add doctor");
      }
    } catch (error) {
      console.error("Error adding doctor:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validasi nama dan spesialis
    if (!newDoctorData.name || !newDoctorData.specialty) {
      alert("Please fill in the required fields: Name and Specialty");
      return;
    }

    try {
      // Submit data dokter
      await handleAddDoctor();
      // Tutup pop up setelah submit
      handlePopupClose();
    } catch (error) {
      console.error("Error submitting doctor data:", error);
      // Tampilkan pesan kesalahan kepada pengguna
      alert("Failed to submit doctor data. Please try again later.");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this patient?"
    );
    if (confirmDelete) {
      try {
        // Delete patient from server
        const response = await fetch(`${API_URL}/delete-user/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          // Remove deleted patient from state
          setPatients(patients.filter((patient) => patient._id !== id));
        } else {
          console.error("Failed to delete patient");
        }
      } catch (error) {
        console.error("Error deleting patient:", error);
      }
    }
  };

  const handleDeleteDoctor = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this doctor?"
    );
    if (confirmDelete) {
      try {
        // Delete doctor from server
        const response = await fetch(`${API_URL}/doctors/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          // Remove deleted doctor from state
          setDoctors(doctors.filter((doctor) => doctor._id !== id));
        } else {
          console.error("Failed to delete doctor");
        }
      } catch (error) {
        console.error("Error deleting doctor:", error);
      }
    }
  };

  return (
    <div className="flex flex-col w-full p-5">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold mb-2">Users List</h1>
          <p className="text-gray-400 mb-6">
            Dashboard / <span className="text-violet-500">Users</span>
          </p>
        </div>
      </div>

      {/* Tabel pengguna */}
      <div className="bg-white p-5 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Table Patinets</h2>
        <table className="table-fixed w-full rounded-lg">
          <thead>
            <tr>
              <th className="w-1/4 p-3 text-start">Name</th>
              <th className="w-1/4 p-3 text-start">Email</th>
              <th className="w-1/4 p-3 text-start">Phone</th>
              <th className="w-1/4 p-3 text-start">Action</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient, index) => (
              <tr
                key={patient._id}
                className={index % 2 === 0 ? "bg-violet-100" : "bg-white"}
              >
                <td className="p-3">{patient.fullName}</td>
                <td className="p-3">{patient.email}</td>
                <td className="p-3">{patient.phone}</td>
                <td className="flex flex-row p-3 gap-2">
                  <button className="text-white bg-violet-500 hover:bg-violet-600 py-1 px-2 rounded-lg transition-colors duration-300">
                    View
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-500 focus:ring-opacity-50"
                    onClick={() => handleDelete(patient._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* tabel doktor  */}
      <div className="bg-white p-5 rounded-lg mt-5">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold mb-4">Table Doctors</h2>
          <button
            className="flex flex-row items-center gap-2 text-violet-500 border-2 border-violet-500 px-4 py-2 rounded-lg hover:bg-violet-500 hover:text-white"
            onClick={() => setShowAddDoctorPopup(true)}
          >
            <PiPlus />
            <p>Add Doctor</p>
          </button>
        </div>
        <table className="table-fixed w-full rounded-lg">
          <thead>
            <tr>
              <th className="w-2/6 p-3 text-start">Name</th>
              <th className="w-2/6 p-3 text-start">Specialty</th>
              <th className="w-1/6 p-3 text-start">Action</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-violet-100" : "bg-white"}
              >
                <td className="p-3">{doctor.name}</td>
                <td className="p-3">{doctor.specialty}</td>
                <td className="flex flex-row p-3 gap-2">
                  {/* Tambahkan tombol "View" dan "Delete" sesuai kebutuhan */}
                  <button className="text-white bg-violet-500 hover:bg-violet-600 py-1 px-2 rounded-lg transition-colors duration-300">
                    View
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-500 focus:ring-opacity-50"
                    onClick={() => handleDeleteDoctor(doctor._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pop up tambah dokter */}
      {showAddDoctorPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Add Doctor</h2>
            <form onSubmit={handleSubmit}>
              {/* Form tambah dokter */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={newDoctorData.name}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Specialty <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="specialty"
                  value={newDoctorData.specialty}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter specialty"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Image
                </label>
                <input
                  type="file"
                  name="image"
                  accept=".png, .jpg, .jpeg"
                  onChange={loadImage}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter image URL"
                  required
                />
                {preview && (
                  <figure className="mt-2 h-20 w-20">
                    <img src={preview} alt="Product Preview" />
                  </figure>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-violet-500 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Add Doctor
                </button>
                <button
                  type="button"
                  onClick={handlePopupClose}
                  className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg ml-4"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;

import { useState, useEffect } from "react";
import FormAppointment from "../../components/FormAppointment";
import PropTypes from "prop-types";

const User = ({ userData }) => {
  const [doctors, setDoctors] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentData, setAppointmentData] = useState({
    patientName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    doctorName: "",
    status: "",
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("${API_URL}/doctors");
        if (response.ok) {
          const data = await response.json();
          setDoctors(data);
        } else {
          console.error("Failed to fetch doctors");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchDoctors();
  }, []);

  const handleCardClick = (doctor) => {
    setShowPopup(true);
    setSelectedDoctor(doctor);
    setAppointmentData({
      ...appointmentData,
      doctorName: doctor.name,
      patientName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      status: "pending",
    });
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedDoctor(null);
    setAppointmentData({
      patientName: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      doctorName: "",
      status: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData({
      ...appointmentData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("${API_URL}/upload-queue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });
      if (response.ok) {
        console.log("Appointment submitted successfully!");
        handleClosePopup();
      } else {
        console.error("Failed to submit appointment");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const generateTimeOptions = () => {
    return ["08:00", "10:00", "13:00", "15:00", "17:00"];
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-4 p-4">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-violet-100 rounded-lg shadow-md p-4 cursor-pointer"
            onClick={() => handleCardClick(doctor)}
          >
            <img
              src={doctor.url} // Gunakan properti url untuk mengambil gambar
              alt={doctor.name}
              className="w-full max-h-42 object-cover rounded-md mb-4"
              style={{ objectFit: "cover" }}
            />
            <div className="text-lg font-semibold">{doctor.name}</div>
            <div className="text-gray-500">{doctor.specialty}</div>
          </div>
        ))}
      </div>
      {showPopup && (
        <FormAppointment
          appointmentData={appointmentData}
          handleClosePopup={handleClosePopup}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          generateTimeOptions={generateTimeOptions}
          selectedDoctor={selectedDoctor}
        />
      )}
    </>
  );
};

User.propTypes = {
  userData: PropTypes.object,
};

export default User;

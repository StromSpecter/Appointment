import { useState, useEffect } from "react";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day < 10 ? "0" + day : day}-${
    month < 10 ? "0" + month : month
  }-${year}`;
};

const AppointmentCard = ({ appointment }) => {
  const getStatusColor = (status) => {
    return status === "finish" ? "bg-green-500" : "bg-orange-500";
  };

  return (
    <div className="flex w-full bg-yellow-100 p-4 rounded-lg shadow-md mb-4 ">
      <div className="w-3/4">
        <h2 className="text-lg font-semibold mb-2">
          {formatDate(appointment.date)}
        </h2>
        <p className="text-gray-600 mb-2">Doctor: {appointment.doctorName}</p>
        <p className="text-gray-600 mb-2">Patient: {appointment.patientName}</p>
        <p className="text-gray-600 mb-2">Time: {appointment.time}</p>
      </div>
      <div className="w-1/4 flex justify-end items-center">
        <p
          className={`text-white mb-2 p-2 rounded-lg ${getStatusColor(
            appointment.status
          )}`}
        >
          {appointment.status}
        </p>
      </div>
    </div>
  );
};

const History = () => {
  const [appointments, setAppointments] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch appointment data from server
    const fetchData = async () => {
      try {
        const response = await fetch("${API_URL}/all-queue");
        if (response.ok) {
          const data = await response.json();
          setAppointments(data);
        } else {
          console.error("Failed to fetch appointment data");
        }
      } catch (error) {
        console.error("Error fetching appointment data:", error);
      }
    };

    fetchData();

    // Get user data from local storage
    const user = localStorage.getItem("userData");
    if (user) {
      setUserData(JSON.parse(user));
    }
  }, []);

  // Filter appointments based on user's name
  const filteredAppointments = appointments.filter(
    (appointment) => appointment.patientName === userData?.fullName
  );

  // Sort appointments by date
  const sortedAppointments = filteredAppointments.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Appointment History</h1>
      <div className="w-2/3 md:w-1/3">
        {sortedAppointments.map((appointment, index) => (
          <AppointmentCard key={index} appointment={appointment} />
        ))}
      </div>
    </div>
  );
};

export default History;

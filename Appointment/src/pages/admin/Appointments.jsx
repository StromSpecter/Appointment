import { useState, useEffect } from "react";
import { API_URL } from "../../../cons";

const Appointments = () => {
  const [unfinishedAppointments, setUnfinishedAppointments] = useState([]);
  const [finishedAppointments, setFinishedAppointments] = useState([]);

  useEffect(() => {
    // Ambil data janji temu dari backend ketika komponen dimuat
    fetch("${API_URL}/all-queue")
      .then((response) => response.json())
      .then((data) => {
        // Pisahkan data yang belum selesai dan memiliki status pending
        const unfinished = data.filter(
          (appointment) =>
            !appointment.finished && appointment.status === "pending"
        );
        // Pisahkan data yang sudah selesai
        const finished = data.filter(
          (appointment) =>
            !appointment.finished && appointment.status === "finish"
        );

        // Setel data janji temu yang belum selesai ke state
        setUnfinishedAppointments(unfinished);

        // Setel data janji temu yang sudah selesai ke state
        setFinishedAppointments(finished);
      })
      .catch((error) => {
        console.error("Failed to fetch appointments:", error);
      });
  }, []);

  const updateAppointmentStatus = async (id) => {
    try {
      const response = await fetch(`${API_URL}/update-queue/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "finish" }), // Kirim data status yang baru
      });
      if (response.ok) {
        console.log("Appointment status updated successfully!");
      } else {
        console.error("Failed to update appointment status");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Fungsi untuk menyelesaikan janji temu
  const handleFinishAppointment = async (index) => {
    const appointmentToFinish = unfinishedAppointments[index];
    const appointmentId = appointmentToFinish._id;

    // Kirim permintaan untuk memperbarui status janji temu
    await updateAppointmentStatus(appointmentId);

    // Tambahkan janji temu ke tabel yang sudah selesai
    setFinishedAppointments((prevFinishedAppointments) => [
      ...prevFinishedAppointments,
      { ...appointmentToFinish, finished: true },
    ]);

    // Hapus janji temu dari tabel yang belum selesai
    setUnfinishedAppointments((prevUnfinishedAppointments) =>
      prevUnfinishedAppointments.filter((_, i) => i !== index)
    );
  };

  // Fungsi untuk menghapus janji temu yang sudah selesai
  const handleDeleteFinishedAppointment = (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this appointment?"
    );

    if (isConfirmed) {
      // Kirim permintaan ke backend untuk menghapus data dari database
      fetch(`${API_URL}/queue/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            // Hapus data dari state jika berhasil
            setUnfinishedAppointments((prevUnfinishedAppointments) =>
              prevUnfinishedAppointments.filter(
                (appointment) => appointment._id !== id
              )
            );
            console.log(
              "Appointment deleted successfully from web and backend:",
              id
            );
          } else {
            console.error("Failed to delete appointment");
          }
          return response.json();
        })
        .catch((error) => {
          console.error("Failed to delete appointment:", error);
        });
    }
  };

  return (
    <div className="flex flex-col w-full p-5">
      <div className="flex flex-col">
        <h1 className="mb-2 text-2xl font-bold">Appointments List</h1>
        <p className="mb-6 text-gray-400">
          Dashboard / <span className="text-violet-500">Appointments</span>
        </p>
      </div>

      {/* Tabel janji temu yang belum selesai */}
      <div className="p-5 mb-8 bg-white rounded-lg">
        <table className="w-full rounded-lg table-fixed">
          <thead>
            <tr>
              <th className="w-1/12 p-3 text-start">No.</th>
              <th className="w-1/6 p-3 text-start">Name</th>
              <th className="w-1/6 p-3 text-start">Doctor</th>
              <th className="w-1/6 p-3 text-start">Date</th>
              <th className="w-1/6 p-3 text-start">Appointment Time</th>
              <th className="w-1/6 p-3 text-start">Action</th>
            </tr>
          </thead>
          <tbody>
            {unfinishedAppointments.map((appointment, index) => (
              <tr
                key={appointment._id}
                className={index % 2 === 0 ? "bg-violet-100" : "bg-white"}
              >
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{appointment.patientName}</td>
                <td className="p-3">{appointment.doctorName}</td>
                <td className="p-3">{appointment.date}</td>
                <td className="p-3">{appointment.time}</td>
                <td className="flex flex-row gap-2 p-3">
                  <button
                    onClick={() => handleFinishAppointment(index)}
                    className="px-2 py-1 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-500 focus:ring-opacity-50"
                  >
                    Finish
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteFinishedAppointment(appointment._id)
                    }
                    className="px-2 py-1 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-500 focus:ring-opacity-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tabel janji temu yang sudah selesai */}
      <div className="p-5 bg-white rounded-lg">
        <h2 className="mb-2 text-lg font-semibold">Finished Appointments</h2>

        <table className="w-full rounded-lg table-fixed">
          <thead>
            <tr>
              <th className="w-1/12 p-3 text-start">No.</th>
              <th className="w-1/6 p-3 text-start">Name</th>
              <th className="w-1/6 p-3 text-start">Doctor</th>
              <th className="w-1/6 p-3 text-start">Date</th>
              <th className="w-1/6 p-3 text-start">Time</th>
            </tr>
          </thead>
          <tbody>
            {finishedAppointments.map((appointment, index) => (
              <tr
                key={appointment._id}
                className={index % 2 === 0 ? "bg-violet-100" : "bg-white"}
              >
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{appointment.patientName}</td>
                <td className="p-3">{appointment.doctorName}</td>
                <td className="p-3">{appointment.date}</td>
                <td className="p-3">{appointment.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointments;

import { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import { API_URL } from "../../../cons";

const PieChart = ({ doctors, appointments }) => {
  const appointmentCounts = {};

  appointments.forEach((appointment) => {
    if (appointmentCounts[appointment.doctorName]) {
      appointmentCounts[appointment.doctorName]++;
    } else {
      appointmentCounts[appointment.doctorName] = 1;
    }
  });

  const data = {
    labels: doctors.map((doctor) => doctor.name),
    datasets: [
      {
        label: "Doctor Appointments",
        data: doctors.map((doctor) => appointmentCounts[doctor.name] || 0),
        backgroundColor: [
          "rgba(0, 128, 0, 0.6)", // Hijau
          "rgba(0, 0, 255, 0.6)", // Biru
          "rgba(255, 0, 0, 0.6)", // Merah
        ],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          generateLabels: function (chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const percent = (
                  (data.datasets[0].data[i] / appointments.length) *
                  100
                ).toFixed(2);
                return {
                  text: `${label} - ${percent}%`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                };
              });
            }
            return [];
          },
        },
      },
    },
  };

  return <Pie data={data} options={options} />;
};

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // Lakukan pengambilan data pasien dari server dengan role = user
        const response = await fetch(`${API_URL}/get-user?role=user`);
        if (response.ok) {
          const data = await response.json();
          // Simpan data pasien ke dalam state
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
          // Simpan data dokter ke dalam state
          setDoctors(data);
        } else {
          console.error("Failed to fetch doctors data");
        }
      } catch (error) {
        console.error("Error fetching doctors data:", error);
      }
    };

    const fetchAppointments = async () => {
      try {
        // Lakukan pengambilan data janji temu dari server
        const response = await fetch(`${API_URL}/all-queue`);
        if (response.ok) {
          const data = await response.json();
          // Simpan data janji temu ke dalam state
          setAppointments(data);
        } else {
          console.error("Failed to fetch appointments data");
        }
      } catch (error) {
        console.error("Error fetching appointments data:", error);
      }
    };

    // Panggil fungsi untuk mengambil data pasien, dokter, dan janji temu saat komponen dimuat
    fetchPatients();
    fetchDoctors();
    fetchAppointments();
  }, []); // Ketergantungan kosong, sehingga efek samping hanya berjalan sekali saat komponen dimuat

  const totalPatients = patients.length;
  const totalDoctors = doctors.length;
  const totalAppointments = appointments.length;

  const appointmentCountsByMonth = {
    Jan: 0,
    Feb: 0,
    Mar: 0,
    Apr: 0,
    May: 0,
    Jun: 0,
    Jul: 0,
    Aug: 0,
    Sep: 0,
    Oct: 0,
    Nov: 0,
    Dec: 0,
  };

  // Loop melalui data janji temu untuk menghitung jumlah janji temu untuk setiap bulan
  appointments.forEach((appointment) => {
    const date = new Date(appointment.date);
    const month = date.toLocaleString("en", { month: "short" });
    appointmentCountsByMonth[month] += 1;
  });

  // Ambil data untuk chart dari objek appointmentCountsByMonth
  const chartData = {
    labels: Object.keys(appointmentCountsByMonth),
    datasets: [
      {
        label: "Total Appointments",
        data: Object.values(appointmentCountsByMonth),
        backgroundColor: "rgba(183, 101, 255, 1)",
        borderColor: "rgba(138, 43, 226, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="flex flex-col w-full h-full gap-5 p-5">
      {/* top section  */}
      <div className="flex flex-col w-full gap-5 md:flex-row">
        <div className="w-1/3 p-4 text-white bg-blue-500 rounded-lg">
          <h2 className="text-2xl">Total Patients</h2>
          <p className="text-4xl font-bold">{totalPatients}</p>
        </div>
        <div className="w-1/3 p-4 text-white bg-green-500 rounded-lg">
          <h2 className="text-2xl">Total Doctors</h2>
          <p className="text-4xl font-bold">{totalDoctors}</p>
        </div>
        <div className="w-1/3 p-4 text-white bg-red-500 rounded-lg">
          <h2 className="text-2xl">Total Appointments</h2>
          <p className="text-4xl font-bold">{totalAppointments}</p>
        </div>
      </div>

      {/* bottom section  */}
      <div className="flex flex-col w-full gap-5 md:flex-row">
        <div className="w-2/3 p-4 bg-white rounded-lg">
          <Bar data={chartData} options={options} />
        </div>
        <div className="w-1/3 p-16 bg-white rounded-lg">
          <PieChart doctors={doctors} appointments={appointments} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

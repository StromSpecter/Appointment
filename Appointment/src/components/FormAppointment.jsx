import PropTypes from "prop-types";

const FormAppointment = ({
  appointmentData,
  handleClosePopup,
  handleInputChange,
  handleSubmit,
  generateTimeOptions,
  selectedDoctor,
  phoneDisabled,
}) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          Appointment with {selectedDoctor?.name}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Input data appointment */}
          <div className="mb-4">
            <label
              htmlFor="patientName"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Patient Name
            </label>
            <input
              type="text"
              id="patientName"
              name="patientName"
              value={appointmentData.patientName}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-slate-300 hover:cursor-not-allowed"
              placeholder="Patient Name"
              required
              disabled
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={appointmentData.email}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-slate-300 hover:cursor-not-allowed"
              placeholder="Email Address"
              required
              disabled
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="phone"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={appointmentData.phone}
              onChange={handleInputChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                phoneDisabled ? "bg-slate-300 cursor-not-allowed" : ""
              }`}
              placeholder="Phone Number"
              required
              disabled={phoneDisabled}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="date"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={appointmentData.date}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="date"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Time
            </label>
            <select
              name="time"
              value={appointmentData.time}
              onChange={handleInputChange}
              required
              className="block w-full border-gray-300 rounded-md shadow-sm focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 py-2 px-3 text-gray-700 leading-tight"
            >
              <option value="">Pilih Waktu</option>
              {generateTimeOptions().map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          {/* Tambahkan input untuk data dokter */}
          <input
            type="hidden"
            name="doctorName"
            value={appointmentData.doctorName}
            readOnly
          />
          {/* Tambahkan input untuk status appointment */}
          <input
            type="hidden"
            name="status"
            value={appointmentData.status}
            readOnly
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-violet-500 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={handleClosePopup}
              className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg ml-4"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

FormAppointment.propTypes = {
  handleClosePopup: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  generateTimeOptions: PropTypes.func.isRequired,
  appointmentData: PropTypes.object.isRequired,
  selectedDoctor: PropTypes.object, 
  phoneDisabled: PropTypes.bool.isRequired,
  finishedStatus: PropTypes.bool.isRequired,
};

export default FormAppointment;

import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

function DrAppoint() {
  const { doctors } = useContext(AppContext);

  return (
    <div className="mt-30 px-4 my-8">
      <p className="pb-3 mt-12 text-xl font-semibold text-gray-800 border-b border-gray-300">
        My Appointments
      </p>

      <div className="grid gap-6 mt-8">
        {doctors.slice(0, 4).map((item, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row gap-6 p-4 rounded-xl shadow-md border border-gray-200 bg-white hover:shadow-lg transition-shadow"
          >

            <div className="flex-shrink-0">
              <img
                className="w-32 h-32 object-cover bg-indigo-100 rounded-lg"
                src={item.image}
                alt={item.name}
              />
            </div>


            <div className="flex-1 text-gray-700 space-y-1">
              <p className="text-lg font-bold text-gray-900">{item.name}</p>
              <p className="text-sm">{item.speciality}</p>

              <p className="mt-2 font-semibold text-gray-600">Address:</p>
              <p className="text-sm">
                {item.address.line1}, {item.address.line2}
              </p>

              <p className="mt-2 text-sm">
                <span className="font-medium text-gray-800">Date & Time:</span>{" "}
                10 May, 2025 | 8:30 PM
              </p>
            </div>

            <div className="flex flex-col justify-center gap-2 mt-4 sm:mt-0">
              <button className="px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-md transition-all duration-300 cursor-pointer">
                Pay Here
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-all duration-300 cursor-pointer">
                Cancel Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DrAppoint;

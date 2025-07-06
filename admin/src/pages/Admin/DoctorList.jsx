  import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import AdminDoctorProfile from "./DoctorProfile";

const DoctorList = () => {
  const { doctors, AdminToken, getAllDoctors , changeAvailability} = useContext(AdminContext);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    if (AdminToken) {
      getAllDoctors();
    }
  }, [AdminToken]);

  return (
    <div className="w-full max-w-screen-xl px-4 mx-auto">
      <div className="flex flex-col items-center gap-4 my-12 text-gray-900">
        <h1 className="text-3xl mt-6 font-bold">
          Doctor <span className="text-[#1c7856]">List</span>
        </h1>
        <p className="sm:w-1/2 text-center text-md">
          Manage all registered doctors from here.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-12">
        {doctors.length > 0 ? (
          doctors.map((item, index) => (
            <div
              key={index}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:bg-blue-100"
              onClick={() => setSelectedDoctor(item)}
            >
              <div className="bg-blue-50 w-full h-64 flex items-start justify-center">
                <img
                  className="h-full object-contain"
                  src={item.image}
                  alt={item.name}
                />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    onChange={e => { e.stopPropagation(); changeAvailability(item._id); }}
                    type="checkbox"
                    checked={item.available}
                    readOnly
                    className="accent-green-500 w-4 h-4"
                    onClick={e => e.stopPropagation()}
                  />
                  <label>
                    {item.available ? "Available" : "Not Available"}
                  </label>
                </div>
                <p className="mt-2 font-semibold text-gray-900 text-lg">
                  {item.name}
                </p>
                <p className="text-sm text-gray-600">
                  {item.speciality || item.specialization}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No doctors found.
          </p>
        )}
      </div>
      {/* Doctor Profile Modal */}
      {selectedDoctor && (
        <AdminDoctorProfile doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} />
      )}
    </div>
  );
};

export default DoctorList;

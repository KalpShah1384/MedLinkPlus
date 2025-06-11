import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

function ConsultDr() {
  const navigate = useNavigate();
  const { specialization } = useParams();
  const { doctors } = useContext(AppContext);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const applyFilter = () => {
    if (specialization) {
      setFilteredDoctors(
        doctors.filter(
          (doc) =>
            doc.specialization &&
            doc.specialization.trim().toLowerCase() ===
              specialization.trim().toLowerCase()
        )
      );
    } else {
      setFilteredDoctors(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, specialization]);

  const specialities = [
    "General Physician",
    "Gynecologist",
    "Cardiologist",
    "Dermatologist",
    "Orthopedic",
    "Gastroenterologist",
  ];

  return (
    <div className="flex flex-col items-center gap-4 my-12 text-gray-900 md:mx-10">
      <h1 className="text-3xl mt-10">Top Doctors</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Let's communicate with the most trusted doctors.
      </p>
      <p className="text-gray-600">Browse through the doctors specialist.</p>

      <div className="flex flex-col sm:flex-row items-start sm:gap-16 gap-5 mt-5 w-full px-4 sm:px-0">
        <div className="flex flex-col gap-4 text-sm text-gray-600">
          {specialities.map((spec) => (
            <p
              key={spec}
              onClick={() =>
                specialization === spec
                  ? navigate("/consultdoctor")
                  : navigate(`/consultdoctor/${spec}`)
              }
              className="w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer"
            >
              {spec}
            </p>
          ))}
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-5">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((item, index) => (
              <div
                onClick={() => navigate(`/appointments/${item._id}`)}
                key={index}
                className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500"
              >
                <div className="bg-blue-50 w-full h-64 flex items-start justify-center">
                  <img
                    className="h-full object-contain"
                    src={item.image}
                    alt="doctor"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-sm text-green-500">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <p>Available</p>
                  </div>
                  <p className="mt-2 font-semibold text-gray-900 text-lg">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-600">{item.specialization}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No doctors found for this speciality.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConsultDr;

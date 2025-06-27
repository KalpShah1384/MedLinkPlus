import React from "react";
import drlist from "../../public/drlist.json";

function FindHospital() {
  const filterData = drlist.filter((data) => data.location === "Vadodara");

  return (
    <>
      <div className="max-w-screen-2xl container mx-auto px-4 md:px-8 mt-20">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Find <span className="text-green-700">Hospitals</span> Near You
          </h1>
          <p className="mt-3 text-gray-500 text-lg max-w-xl mx-auto">
            Discover the best hospitals in Vadodara based on your needs.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filterData.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-5 flex flex-col"
            >
              <img
                src={item.image}
                alt={item.name}
                className="rounded-xl w-full h-48 object-cover mb-4"
              />

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 text-center mb-1">
                    {item.name}
                  </h2>
                  <p className="text-gray-600 text-center text-sm mb-2">
                    {item.title}
                  </p>
                </div>

                <div className="flex flex-col gap-2 mt-4">
                  <a
                    href={item.address}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    📍 View on Map
                  </a>
                  <button className="text-center bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                    🩺 Consult Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Case */}
        {filterData.length === 0 && (
          <div className="text-center text-red-500 font-medium mt-10">
            No hospitals found in Vadodara.
          </div>
        )}
      </div>
    </>
  );
}

export default FindHospital;

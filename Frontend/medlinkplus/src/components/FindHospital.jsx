import React from 'react'
import drlist from '../../public/drlist.json'
import Cards from './Cards'
function FindHospital() {
    const filterData = drlist.filter((data) => data.location === "Vadodara");
    return (
      <>
        <div className="max-w-screen-2xl container mx-auto md:px-20 px-4 mt-25">
          <h1 className="font-bold text-3xl text-center">
            Check For <span className="text-green-700">Hospitals</span>
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Get your desired hospital based on what you needed.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-8 p-3 my-10">
          {filterData.map((item) => (
            <div key={item.id} className="flex">
              <div
                className="border rounded-lg shadow-md p-5 flex flex-col h-full w-full 
          transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="rounded-md w-full h-48 object-cover mb-4"
                />

                <h2 className="text-lg font-semibold mb-2 text-center">
                  {item.name}
                </h2>
                <p className="text-gray-600 flex-grow text-center text-md">
                  {item.title}
                </p>
                <div className="flex flex-col gap-2 mt-4">
                  <a
                    href={item.address}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#1c7856] hover:bg-green-600 text-white py-2 px-4 rounded-md text-center transition-colors duration-300 cursor-pointer"
                  >
                    View on Map
                  </a>
                  <button className="bg-[#1c7856] hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors duration-300 cursor-pointer">
                    Consult
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
}

export default FindHospital
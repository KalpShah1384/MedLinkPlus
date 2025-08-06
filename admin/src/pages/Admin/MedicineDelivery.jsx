import React from "react";
import MedicineDeliveryList from "../../components/MedicineDeliveryList";
import medicineImg from '../../assets/medicine.png';

const MedicineDelivery = () => {
  return (
    <div className="w-full max-w-screen-xl px-4 mx-auto">
      <div className="flex flex-col items-center gap-4 my-12 text-gray-900">
        <img src="/medicine.png" alt="Medicine Delivery Logo" className="w-20 h-20 mb-2" />
        <h1 className="text-3xl mt-6 font-bold">
          Medicine <span className="text-[#1c7856]">Delivery</span>
        </h1>
        <p className="sm:w-1/2 text-center text-md">
          View and manage all medicine delivery orders from here.
        </p>
      </div>
      <MedicineDeliveryList />
    </div>
  );
};

export default MedicineDelivery;

import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../../../../assets/assets/assets_frontend/assets";
import { toast } from "react-toastify";
import axios from "axios";

const Appointments = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol  , backendUrl , getDoctorsdata} = useContext(AppContext);

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const navigate = useNavigate();
  const [docInfo, setdocInfo] = useState({});
  const [docslot, setdocslot] = useState([]);
  const [slotindex, setslotindex] = useState(0);
  const [slotTime, setslotTime] = useState("");

  useEffect(() => {
    const fetchDocInfo = () => {
      const doc = doctors.find((doc) => doc._id === docId);
      setdocInfo(doc);
    };
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    const getAvailableSlots = () => {
      let today = new Date();
      const slotList = [];

      for (let i = 0; i < 10; i++) {
        let currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);

        let endTime = new Date(currentDate);
        endTime.setHours(21, 0, 0, 0);

        if (today.getDate() === currentDate.getDate()) {
          currentDate.setHours(Math.max(currentDate.getHours() + 1, 10));
          currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
        } else {
          currentDate.setHours(10);
          currentDate.setMinutes(0);
        }

        let timeslots = [];
        while (currentDate < endTime) {
          let slot = currentDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          let day = currentDate.getDate()
          let month = currentDate.getMonth() + 1
          let year = currentDate.getFullYear()
          
          const slotDate = day + "_" + month + "_" + year
          const slotTime = slot

          const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime)?false:true
          if (isSlotAvailable) {
            timeslots.push({
              datetime: new Date(currentDate),
              time: slot,
            });
          }

          currentDate.setMinutes(currentDate.getMinutes() + 30);
        }

        slotList.push(timeslots);
      }

      setdocslot(slotList);
    };

    if (docInfo?._id) getAvailableSlots();
  }, [docInfo]);

  const bookAppointment = async () => {
    const token = localStorage.getItem("token"); // <-- fix added

    if (!token) {
      toast.warn("Please login to book an appointment");
      return navigate("/login");
    }
    try {
      const date = docslot[slotindex][0].datetime
      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()
      const slotDate = day + "_" + month + "_" + year
      const { data } = await axios.post(backendUrl + '/api/user/bookappointment', { slotDate, slotTime, docId }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getDoctorsdata()
        navigate("/userappoint")
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  };

  return (
    docInfo && (
      <div className="mt-40 px-4 flex justify-center">
        <div className="w-full max-w-6xl mb-20"> {/* Added margin bottom to avoid sticking to footer */}
          {/* Profile Section */}
          <div className="flex flex-col sm:flex-row gap-6 sm:h-[320px]">
            {/* Image */}
            <div className="sm:w-[300px] h-full">
              <img
                className="w-full h-full object-cover rounded-xl bg-[#1c7856]"
                src={docInfo.image}
                alt=""
              />
            </div>

            {/* Info */}
            <div className="flex-1 border border-gray-300 rounded-xl p-6 bg-white flex flex-col justify-between">
              <div>
                <p className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
                  {docInfo.name}
                  <img className="w-5" src={assets.verified_icon} alt="" />
                </p>
                <div className="flex items-center gap-3 text-sm mt-2 text-gray-600">
                  <p>
                    {docInfo.degree} - {docInfo.speciality}
                  </p>
                  <span className="py-0.5 px-2 bg-gray-100 border rounded-full text-xs">
                    {docInfo.experience}
                  </span>
                </div>
                <div className="mt-4">
                  <p className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                    About
                    <img src={assets.info_icon} alt="info" />
                  </p>
                  <p className="text-sm text-gray-600 mt-1 max-w-3xl">
                    {docInfo.about}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 font-medium mt-4">
                Appointment fee:{" "}
                <span className="text-gray-800">
                  {currencySymbol} {docInfo.fees}
                </span>
              </p>
            </div>
          </div>

          {/* Slot Section */}
          <div className="mt-10">
            <h2 className="font-semibold text-lg text-gray-700 mb-4">
              Booking Slots
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {docslot.length > 0 &&
                docslot.map((item, index) => {
                  const date = item[0]?.datetime;
                  const day = daysOfWeek[date?.getDay()];
                  const dateNumber = date?.getDate();

                  return (
                    <button
                      key={index}
                      onClick={() => setslotindex(index)}
                      className={`min-w-[90px] px-4 py-3 rounded-xl text-sm font-medium text-center shadow-sm transition-colors duration-200 cursor-pointer ${
                        slotindex === index
                          ? "bg-[#1c7856] text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-blue-50"
                      }`}
                    >
                      <p>{day}</p>
                      <p className="mt-1">{dateNumber}</p>
                    </button>
                  );
                })}
            </div>
            <div className="flex items-center gap-3 w-full flex-wrap mt-4">
              {docslot.length &&
                docslot[slotindex].map((item, index) => (
                  <p
                    onClick={() => setslotTime(item.time)}
                    className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer transition-colors duration-200 ${
                      item.time === slotTime
                        ? "bg-[#1c7856] text-white"
                        : "text-gray-400 border border-gray-300"
                    } `}
                    key={index}
                  >
                    {item.time.toLowerCase()}
                  </p>
                ))}
            </div>
            <button
              onClick={bookAppointment}
              className="bg-[#1c7856] cursor-pointer text-sm font-light text-white px-14 py-3 rounded-full my-6"
            >
              Book an Appointment
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default Appointments;

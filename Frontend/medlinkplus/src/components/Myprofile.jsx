import React, { useState } from "react";
import { assets } from "../../../../assets/assets/assets_frontend/assets";
const Myprofile = () => {
  const [userData, setuserData] = useState({
    name: "Tejas Kumar",
    image: assets.profile_pic,
    email: "tejaskumar@gmail.com",
    phone: "+91 990987654",
    address: {
      city: "Bhopal",
      state: "Madhya Pradesh",
      country: "India",
      pincode: "462001",
    },
    gender: "Male",
    dob: "1998-01-01",
  });
  const [isEdit, setisEdit] = useState(true);
  return (
    <div className="max-w-lg mx-auto flex flex-col gap-2 text-sm mt-35 my-10 px-4">
      <img className="w-36 rounded-lg" src={userData.image} alt="" />
      {isEdit ? (
        <input
          className="bg-gray-50 text-3xl font-medium max-w-60 mt-4"
          type="text"
          value={userData.name}
          onChange={(e) =>
            setuserData((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      ) : (
        <p className="font-medium text-3xl text-neutral-800 mt-4">
          {userData.name}
        </p>
      )}
      <hr className="bg-zinc-400 h-[1px] border-none" />
      <div>
        <p className="text-neutral-500 underline mt-3">Contact Information</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium ">Email :</p>
          <p className="text-blue-500">{userData.email}</p>
          <p className="font-medium">Phone :</p>
          {isEdit ? (
            <input
              className="bg-gray-100 max-w-52"
              type="text"
              value={userData.phone}
              onChange={(e) =>
                setuserData((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          ) : (
            <p className="text-blue-500">{userData.phone}</p>
          )}
          <p className="font-medium ">Address :</p>
          {isEdit ? (
            <p>
              <input
                className="bg-gray-50 "
                onChange={(e) =>
                  setuserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, city: e.target.value },
                  }))
                }
                value={userData.address.city}
                type="text"
                name=""
                id=""
              />
              <br />
              <input
                className="bg-gray-50 "
                onChange={(e) =>
                  setuserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, state: e.target.value },
                  }))
                }
                value={userData.address.state}
                type="text"
                name=""
                id=""
              />
              <br />
              <input
                className="bg-gray-50 "
                onChange={(e) =>
                  setuserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, country: e.target.value },
                  }))
                }
                value={userData.address.country}
                type="text"
                name=""
                id=""
              />
              <br />
              <input
                className="bg-gray-50 "
                onChange={(e) =>
                  setuserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, pincode: e.target.value },
                  }))
                }
                value={userData.address.pincode}
                type="text"
                name=""
                id=""
              />
            </p>
          ) : (
            <p className="text-gray-500">
              {userData.address.city}
              <br />
              {userData.address.state}
              <br />
              {userData.address.country}
              <br />
              {userData.address.pincode}
            </p>
          )}
        </div>
      </div>
      <div>
        <p className="text-neutral-500 underline mt-3">Basic Information </p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium ">Gender :</p>
          {isEdit ? (
            <select
              className="max-w-20 bg-gray-100"
              onChange={(e) =>
                setuserData((prev) => ({ ...prev, gender: e.target.value }))
              }
              value={userData.gender}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          ) : (
            <p className="text-gray-400">{userData.gender}</p>
          )}
          <p className="font-medium">DOB:</p>
          {isEdit ? (
            <input
              className="max-w-28 bg-gray-100"
              type="date"
              value={userData.dob}
              onChange={(e) =>
                setuserData((prev) => ({ ...prev, dob: e.target.value }))
              }
            />
          ) : (
            <p className="text-gray-400">{userData.dob}</p>
          )}
        </div>
      </div>
      <div className="mt-10 ">
        {isEdit ? (
          <button
            className="border border-primary px-8 py-2 rounded-full cursor-pointer hover:bg-primary hover:text-white transition-all"
            onClick={() => setisEdit(false)}
          >
            Save Information
          </button>
        ) : (
          <button
            className="border border-primary px-8 py-2 rounded-full cursor-pointer hover:bg-primary hover:text-white transition-all"
            onClick={() => setisEdit(true)}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default Myprofile;

import React, { useState, useContext } from "react";
import { assets } from "../../../../assets/assets/assets_frontend/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { userData, setuserData, token, backendUrl, loadUserProfileData } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);

  const updateProfile = async () => {
    try {
      if (!userData.name.trim()) return toast.error("Name is required");
      if (!userData.phone.trim()) return toast.error("Phone number is required");
      if (!userData.dateOfBirth) return toast.error("Date of birth is required");

      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      if (userData.address && Object.keys(userData.address).length > 0)
        formData.append("address", JSON.stringify(userData.address));
      if (userData.gender) formData.append("gender", userData.gender);
      formData.append("dateOfBirth", userData.dateOfBirth);
      if (image) formData.append("image", image);

      const { data } = await axios.post(`${backendUrl}/api/user/updateprofile`, formData, {
        headers: { token },
      });

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating profile");
    }
  };

  return userData ? (
    <div className="w-full max-w-screen-xl h-fit min-h-[90vh] mx-auto mt-12 px-10 py-16 bg-white rounded-3xl shadow-2xl border border-[#cde9de] flex flex-col justify-between mb-20">
      <div className="flex flex-col items-center mb-12 ">
        <label htmlFor="image" className="relative group cursor-pointer">
          <img
            src={image ? URL.createObjectURL(image) : userData.image}
            alt="Profile"
            className="w-48 h-48 rounded-full object-cover border-4 border-[#1c7856] shadow-xl group-hover:scale-105 transition-transform duration-300"
          />
          {isEdit && (
            <div className="absolute bottom-0 right-0 bg-white border border-[#1c7856] p-1 rounded-full shadow-md">
              <img src={assets.upload_icon} alt="Upload" className="w-6 h-6" />
            </div>
          )}
          <input
            type="file"
            id="image"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>
        {isEdit ? (
          <input
            type="text"
            value={userData.name}
            onChange={(e) => setuserData({ ...userData, name: e.target.value })}
            className="mt-4 text-center text-3xl font-semibold border-b border-[#1c7856] focus:outline-none focus:border-[#1c7856]"
          />
        ) : (
          <h2 className="mt-4 text-3xl font-bold text-[#1c7856]">{userData.name}</h2>
        )}
        <p className="text-gray-600 text-lg">{userData.email}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10">
        {[
          { label: "Phone", field: "phone" },
          { label: "Date of Birth", field: "dateOfBirth", type: "date" },
          { label: "Gender", field: "gender", type: "select" },
          { label: "City", field: "city", group: "address" },
          { label: "State", field: "state", group: "address" },
          { label: "Country", field: "country", group: "address" },
          { label: "Pincode", field: "pincode", group: "address" },
        ].map(({ label, field, type, group }) => (
          <div key={field}>
            <label className="text-sm font-medium text-[#1c7856]">{label}</label>
            {isEdit ? (
              type === "select" ? (
                <select
                  value={userData[field]}
                  onChange={(e) => setuserData({ ...userData, [field]: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-[#cce3d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c7856]"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <input
                  type={type || "text"}
                  value={group ? userData[group]?.[field] || "" : userData[field] || ""}
                  onChange={(e) =>
                    group
                      ? setuserData((prev) => ({
                          ...prev,
                          [group]: { ...prev[group], [field]: e.target.value },
                        }))
                      : setuserData({ ...userData, [field]: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 border border-[#cce3d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c7856]"
                />
              )
            ) : (
              <p className="mt-1 text-gray-800">
                {group ? userData[group]?.[field] : userData[field]}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-16">
        {isEdit ? (
          <button
            onClick={updateProfile}
            className="bg-[#1c7856] text-white text-lg px-10 py-3 rounded-full hover:bg-[#155d42] transition shadow-md"
          >
            Save Changes
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="border border-[#1c7856] text-[#1c7856] text-lg px-10 py-3 rounded-full hover:bg-[#1c7856] hover:text-white transition shadow-md"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  ) : null;
};

export default MyProfile;

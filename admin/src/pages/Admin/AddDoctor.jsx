import React from "react";
import { assets } from "../../assets/assets_admin/assets";
import { useState } from "react";
import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify"
import axios from "axios";
const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [experience, setExperience] = useState('1 Year');
  const [fees, setFees] = useState('');
  const [specialization, setSpecialization] = useState("Genearal Physician");
  const [degree, setDegree] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [about, setAbout] = useState('');
  const { backendUrl, AdminToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (!docImg) {
        return toast.error("Please upload a doctor image");
      }

      const formData = new FormData()
      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", Number (fees));
      formData.append("specialization", specialization);
      formData.append("degree", degree);
      formData.append("about", about);
      formData.append("address", JSON.stringify({ line1: address1, line2: address2 })); 
      
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
      const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, { headers: { atoken : AdminToken } });
      if (data.success) {
        toast.success(data.message);
        setDocImg(false)
        setName('')
        setEmail('')
        setPassword('')
        setFees('')
        //setExperience('1 Year')
        //setSpecialization("Genearal Physician")
        setDegree('')
        setAddress1('')
        setAddress2('')
        setAbout('')
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
  } 
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <form onSubmit={onSubmitHandler} className="bg-white p-8 rounded-xl shadow-md space-y-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Add <span className="text-[#1c7856]">Doctor</span>
        </h2>

        <div className="flex flex-col items-center">
          <label htmlFor="doc-img" className="cursor-pointer">
            <img
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt="Upload"
              className="w-36 h-36 object-cover rounded-full border-2 border-dashed border-gray-300 hover:border-[#1c7856] transition"
            />
          </label>
          <input
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            hidden
          />
          <p className="text-gray-600 mt-2">Upload Doctor Image</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700">Doctor Name</label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Name"
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-gray-700">Doctor Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email"
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-gray-700">Doctor Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-gray-700">Experience</label>
              <select
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                className="input-field"
                required
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i}>{i + 1} Year</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700">Fees</label>
              <input
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                type="number"
                placeholder="Fees"
                required
                className="input-field"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700">Speciality</label>
              <select
                onChange={(e) => setSpecialization(e.target.value)}
                value={specialization}
                className="input-field"
                required
              >
                <option>General Physician</option>
                <option>Gynecologist</option>
                <option>Dermatologist</option>
                <option>Neurologist</option>
                <option>Gastroenterologist</option>
                <option>Pediatricians</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700">Degree</label>
              <input
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                type="text"
                placeholder="Degree"
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-gray-700">Address</label>
              <input
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                type="text"
                placeholder="Address 1"
                required
                className="input-field mb-2"
              />
              <input
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                type="text"
                placeholder="Address 2"
                required
                className="input-field"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">About Doctor</label>
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            placeholder="About Doctor"
            rows={5}
            required
            className="input-field w-full"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-[#1c7856] text-white px-6 py-2 rounded-lg hover:bg-green-500 transition font-medium"
          >
            Add Doctor
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;

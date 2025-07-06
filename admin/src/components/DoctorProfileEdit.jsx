import React, { useState } from "react";

const DoctorProfileEdit = ({ doctor, onSave, onCancel }) => {
  const [form, setForm] = useState({
    name: doctor.name || '',
    email: doctor.email || '',
    phone: doctor.phone || '',
    speciality: doctor.speciality || doctor.specialization || '',
    about: doctor.about || '',
    experience: doctor.experience || '',
    location: doctor.location || '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div className="flex gap-3">
        <input name="name" value={form.name} onChange={handleChange} className="input input-bordered flex-1" placeholder="Name" />
        <input name="email" value={form.email} onChange={handleChange} className="input input-bordered flex-1" placeholder="Email" />
      </div>
      <div className="flex gap-3">
        <input name="phone" value={form.phone} onChange={handleChange} className="input input-bordered flex-1" placeholder="Phone" />
        <input name="speciality" value={form.speciality} onChange={handleChange} className="input input-bordered flex-1" placeholder="Speciality" />
      </div>
      <input name="location" value={form.location} onChange={handleChange} className="input input-bordered w-full" placeholder="Location" />
      <input name="experience" value={form.experience} onChange={handleChange} className="input input-bordered w-full" placeholder="Experience (years)" />
      <textarea name="about" value={form.about} onChange={handleChange} className="input input-bordered w-full h-20" placeholder="About doctor..." />
      <div className="flex gap-4 mt-2">
        <button type="submit" className="btn bg-[#1c7856] text-white hover:bg-[#155c43]">Save</button>
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default DoctorProfileEdit;

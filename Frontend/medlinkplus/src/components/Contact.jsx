import React, { useState } from "react";
import contact from "../../public/Contactus.png";
import { useForm } from "react-hook-form";
import axios from "axios";

function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post("http://localhost:4000/api/contact/submit", data);
      setSuccessMessage("Message sent successfully!");
      reset();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Failed to send message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Image */}
        <div className="flex justify-center">
          <img
            src={contact}
            alt="Contact"
            className="w-full max-w-md h-auto object-contain"
          />
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 shadow-xl rounded-xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-4xl font-bold mb-6">
            Contact <span className="text-[#1c7856]">Us</span>
          </h2>

          {successMessage && (
            <div className="mb-4 p-4 bg-green-100 dark:bg-green-200/10 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-500 rounded-md">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-200/10 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-500 rounded-md">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block font-medium">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full py-2 px-4 mt-1 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1c7856] text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                {...register("name", { required: true })}
              />
              {errors.name && (
                <span className="text-sm text-red-500">This field is required</span>
              )}
            </div>

            <div>
              <label className="block font-medium">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full py-2 px-4 mt-1 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1c7856] text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <span className="text-sm text-red-500">This field is required</span>
              )}
            </div>

            <div>
              <label className="block font-medium">Phone Number</label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                className="w-full py-2 px-4 mt-1 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1c7856] text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                {...register("phone", { required: true })}
              />
              {errors.phone && (
                <span className="text-sm text-red-500">This field is required</span>
              )}
            </div>

            <div>
              <label className="block font-medium">Message</label>
              <textarea
                rows="4"
                placeholder="Your message"
                className="w-full py-2 px-4 mt-1 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1c7856] text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                {...register("message", { required: true })}
              ></textarea>
              {errors.message && (
                <span className="text-sm text-red-500">This field is required</span>
              )}
            </div>

            <div className="text-center pt-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#1c7856] hover:bg-[#166b4a] text-white font-semibold py-2 px-8 rounded-lg transition duration-300 disabled:opacity-60"
              >
                {loading ? "Sending..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;

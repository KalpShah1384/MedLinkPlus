import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

function Get() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fade out success message after 3 seconds
  React.useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage("") , 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await axios.post("http://localhost:4000/api/getintouch/submit", data);
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

  // Optional: Tailwind CSS animation
  // Add this to your global CSS if not present:
  // .animate-fade-in-out { @apply opacity-0 animate-fadeInOut; }
  // @keyframes fadeInOut { 0%,100%{opacity:0;} 10%,90%{opacity:1;} }

  return (
    <>
      <div className="max w-screen-2xl container mx-auto md:px-20 px-4 flex flex-col md:flex-row my-30">
        <div className="w-full md:w-1/2 mt-10">
          <h1 className="text-3xl font-semibold">Get in Touch</h1>
          <h4 className="mt-2">Have questions? We'd love to hear from you.</h4>
          <div className="flex items-center space-x-4 mt-5">
            <img src="/phone.png" alt="Phone" />
            <h1>+91 9867839223</h1>
          </div>
          <div className="flex items-center space-x-4 mt-2">
            <img src="/email.png" alt="Email" /> <h1>medilinkplus@gmail.com</h1>
          </div>
          <div className="flex items-center space-x-4 mt-2">
            <img src="/location.png" alt="Location" />
            <h1>12,Shreejidham,Ellisbridge Ahmedabad</h1>
          </div>
        </div>
        <div className="w-full md:w-1/2 mt-10">
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
            {successMessage && (
              <div className="mb-4 flex items-center justify-center animate-fade-in-out p-4 bg-green-100 dark:bg-green-200/10 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-500 rounded-md transition-opacity duration-700">
                <svg className="w-6 h-6 mr-2 text-green-500 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-semibold">{successMessage}</span>
              </div>
            )}
            <div className="text-center pt-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#1c7856] hover:bg-[#166b4a] text-white font-semibold py-2 px-8 rounded-lg transition duration-300 disabled:opacity-60 w-full"
              >
                {loading ? "Sending..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Get;

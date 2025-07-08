import React from "react";
import male from "../../public/Male.png";
import female from "../../public/Female.png";
import bot from "../../public/Bot.png";


import { useChatbot } from "./ChatbotContext";

function Review() {
  const { openChatbot } = useChatbot();
  return (
    <>
      <div className="mt-20">
        <h1 className="text-[#54bd95] text-center text-3xl font-semibold">Testimonials: </h1>
        <h2 className="text-center text-xl font-semibold mt-3">
          Hear from Those We've <span className="text-[#54bd95c]">Cared</span>{" "}
          For
        </h2>
      </div>
      <div className="mt-15 max-w-screen-2xl container mx-auto md:px-20 px-4 flex flex-col md:flex-row my-20">
        <div className="w-full md:w-1/ ">
          <div className="card bg-base-100 image-full w-100 h-40 shadow-sm">
            <figure>
              <img src={male} alt="joshua" />
            </figure>
            <div className="card-body">
              <h2 className="card-title">-Joshua T.</h2>
              <p>
                "I can now access my prescriptions and text results directly
                from my phone."
              </p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 ">
          <div className="card bg-base-100 image-full w-100 h-40 shadow-sm">
            <figure>
              <img src={female} alt="samantha" />
            </figure>
            <div className="card-body">
              <h2 className="card-title">-Samantha K.</h2>
              <p>
                "This software has made my clinic operations faster and more
                organized."
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-screen-2xl container mx-auto md:px-20 px-4 flex flex-col md:flex-row my-20">
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-semibold mt-4">Got Questions?</h1>
          <h4 className="mt-3">Our MediLink Plus Chatbot is here to help 24/7</h4>
          <button className="btn bg-[#1c7856] hover:bg-green-200 mt-3 duration-300" onClick={openChatbot}>Try MediLink Plus Chatbot</button>
        </div>
        <div>
          <div className="p-4 flex items-center justify-center md:ml-56 mt-8 md:mt-0">
  <div className="bg-white border border-[#e0f2ef] rounded-2xl shadow-lg p-8 w-96 flex flex-col items-center hover:shadow-2xl transition-shadow duration-300">
    {/* Chat Bubble Icon */}
    <div className="mb-4">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="24" fill="#e6fff5"/>
        <path d="M16 20C16 17.7909 18.2386 16 21 16H27C29.7614 16 32 17.7909 32 20V26C32 28.2091 29.7614 30 27 30H23.4142C23.149 30 22.8946 30.1054 22.7071 30.2929L20.4142 32.5858C19.6332 33.3668 18.3668 33.3668 17.5858 32.5858C16.8047 31.8047 16.8047 30.5383 17.5858 29.7574L19.2929 28.0503C19.4804 27.8628 19.5858 27.6084 19.5858 27.3431V26V20Z" fill="#54bd95"/>
      </svg>
    </div>
    <h3 className="text-2xl font-bold text-[#1c7856] mb-2 text-center">MediLink Plus Chatbot</h3>
    <p className="text-gray-700 text-center mb-5">Your AI-powered healthcare assistant. Get instant help, manage prescriptions, and more—anytime.</p>
    <button
      className="w-full py-3 rounded-lg bg-[#54bd95] text-white font-semibold text-lg shadow hover:bg-[#1c7856] transition-colors duration-200"
      onClick={openChatbot}
    >
      Try Now
    </button>
  </div>
</div>
        </div>
      </div>
    </>
  );
}

export default Review;

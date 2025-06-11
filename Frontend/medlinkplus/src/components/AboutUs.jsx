import React from "react";
import { Link } from "react-router-dom";
import abpic from "../../public/abpic.png";

function AboutUs() {
  return (
    <>
      <div>
        <div className="text-center text-3xl font-bold text-black mt-15 my-20">
          <p>
            About <span className="text-[#1c7856] font-bold">US</span>
          </p>
        </div>

        <div className="my-16 flex flex-col md:flex-row justify-center items-center md:items-start gap-12 px-6 md:px-20">
          <div className="w-full md:max-w-md flex-shrink-0">
            <img
              className="w-full md:max-w-[360px] rounded-2xl shadow-md object-contain"
              src={abpic}
              alt="About MediLinkPlus"
            />
          </div>

          <div className="md:w-2/4 text-black-700 text-[15px] flex flex-col justify-center gap-6">
            <p>
              <span className="font-semibold text-lg text-[#1c7856]">Medilinkplus</span>
              , we believe healthcare should be seamless, secure, and accessible
              for everyone. We are a next-generation MedTech platform designed
              to simplify healthcare delivery by connecting patients, doctors,
              and pharmacies through innovative digital solutions. Our mission
              is to bridge gaps in healthcare services, optimize medical
              workflows, and put patients at the center of care.
            </p>
            <p>
              MediLinkPlus is an all-in-one healthcare software solution built
              with the future in mind. Whether it's managing digital
              prescriptions, ordering medicines online, or accessing medical
              records securely, our platform streamlines complex processes and
              fosters better communication across the healthcare ecosystem.
            </p>
            <b className="text-black font-semibold text-lg text-base mt-2">
              Our Vision
            </b>
            <p>
              To build an inclusive, intelligent healthcare ecosystem where
              technology improves care, enhances communication, and delivers
              better outcomes for everyone.
            </p>
          </div>
        </div>

        <div className="text-center text-2xl font-bold text-black mt-10 mb-6">
          <p>
            Why Choose <span className="text-[#1c7856]">MediLinkPlus?</span>
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 px-6 md:px-20 mb-20">
          <div className="flex-1 border rounded-xl px-8 py-10 flex flex-col gap-4 text-[15px] text-black shadow-sm hover:bg-[#1c7856] hover:text-white transition-all duration-300 cursor-pointer">
            <b className="text-base">Efficiency</b>
            <p>Improved efficiency in prescribing management.</p>
          </div>

          <div className="flex-1 border rounded-xl px-8 py-10 flex flex-col gap-4 text-[15px] text-black shadow-sm hover:bg-[#1c7856] hover:text-white transition-all duration-300 cursor-pointer ">
            <b className="text-base">Accessibility</b>
            <p>Enhanced accessibility to healthcare services and records.</p>
          </div>

          <div className="flex-1 border rounded-xl px-8 py-10 flex flex-col gap-4 text-[15px] text-black shadow-sm hover:bg-[#1c7856] hover:text-white transition-all duration-300 cursor-pointer">
            <b className="text-base">Patient-Centric Design</b>
            <p>
              Patient-centric design that prioritizes ease of use and
              transparency.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutUs;

//API for adding doctor
import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointment.js";
import userModel from "../models/userModel.js";
import Order from "../models/orderModel.js";

const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      specialization,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;

    if (
      !name ||
      !email ||
      !password ||
      !specialization ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address ||
      !imageFile
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // Check if the password is strong enough
    if (password.length < 6) {
      return res.json({
        success: false,
        message: "Please enter a password with at least 6 characters",
      });
    }

    //Bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imagrUrl = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      password: hashedPassword,
      image: imagrUrl,
      specialization,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address), // <--- Added comma here
      date: Date.now(), // This line is now correct
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.json({ success: true, message: "Doctor added successfully" });
  } catch (error) {
    console.error(error); // Log the full error for debugging
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// api for admin login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
           const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token });
        } else {
            return res.json({ success: false, message: "Invalid email or password" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
//API for alldoctor list
const allDoctors = async (req,res) => {
  try {
    const doctors = await doctorModel.find({}).select('-password')
    res.json({success:true,doctors})

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}
//API FOR APPOINTMENT LIST
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({})
    res.json({success:true,appointments})
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)
    
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancel: true })
    //updating drslot
    const { docId, slotDate, slotTime } = appointmentData
    const doctorData = await doctorModel.findById(docId)
    let slots_booked = doctorData.slots_booked
    slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
    await doctorModel.findByIdAndUpdate(docId, { slots_booked })
    res.json({ success: true, message: "Appointment cancelled successfully" })
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    // --- Analytics: Appointments per month (last 6 months) ---
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const appointmentTrends = Array(6).fill(0).map((_, i) => {
      const month = (now.getMonth() - 5 + i + 12) % 12;
      const year = now.getFullYear() - (now.getMonth() - 5 + i < 0 ? 1 : 0);
      const count = appointments.filter(app => {
        const d = new Date(app.date);
        return d.getMonth() === month && d.getFullYear() === year;
      }).length;
      return { name: months[month], Appointments: count };
    });

    // --- Pie chart: Doctors vs Patients ---
    const userDistribution = [
      { name: 'Doctors', value: doctors.length },
      { name: 'Patients', value: users.length }
    ];

    // --- Recent activity: show latest 5 appointments (rich info) ---
    const recentActivity = appointments
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map(app => ({
        doctorName: app.docData?.name || `Dr.${app.docId}`,
        doctorImage: app.docData?.image || null,
        patientName: app.userData?.name || app.userId,
        patientImage: app.userData?.image || null,
        slotDate: app.slotDate,
        slotTime: app.slotTime,
        amount: app.amount,
        status: app.cancel ? 'Cancelled' : (app.isCompleted ? 'Completed' : 'Upcoming'),
        date: app.date,
      }));

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      appointmentTrends,
      userDistribution,
      recentActivity
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

export { 
  addDoctor, 
  loginAdmin, 
  allDoctors, 
  appointmentsAdmin, 
  appointmentCancel, 
  adminDashboard
};

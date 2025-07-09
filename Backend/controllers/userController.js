import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointment.js";
import razorpay from "razorpay";
import MedicalRecord from "../models/medicalRecordModel.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Multer storage for medical records (local disk)
const medicalRecordStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join("uploads", "medical-records");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
export const uploadMedicalRecordMulter = multer({ storage: medicalRecordStorage });

// POST /api/user/upload-medical-record

// GET /api/user/medical-records
export const getMedicalRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// ================= Register User ===================
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate inputs
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Please fill all fields" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter valid email" });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password should be at least 8 characters long.",
      });
    }

    // Check for existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "Email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const newUser = new userModel({ name, email, password: hashedPassword });
    const user = await newUser.save();

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ success: true, token });
  } catch (error) {
    console.log("Register Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ================= Login User ===================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ success: true, token });
  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ================= Get User Profile ===================
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userData = await userModel.findById(userId).select("-password");

    res.json({ success: true, userData });
  } catch (error) {
    console.log("Profile Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ================= Update User Profile ===================
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, address, dateOfBirth, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dateOfBirth) {
      return res.json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const updateData = {
      name,
      phone,
      dateOfBirth,
      gender,
    };

    // Parse address safely
    if (address) {
      try {
        updateData.address = JSON.parse(address);
      } catch (err) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid address format" });
      }
    }

    // Upload image to Cloudinary
    if (imageFile) {
      const uploadedImage = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      updateData.image = uploadedImage.secure_url;
    }

    const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      userData: updatedUser,
    });
  } catch (error) {
    console.log("Update Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
//Api for appontment 
const bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body;
    const userId = req.user.id;


    const docData = await doctorModel.findById(docId).select('-password')
    if (!docData.available) {
      return res.json({ success: false, message: "Doctor is not available" })
    }
    let slots_booked = docData.slots_booked
    //checking for slot availability
    
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot is already booked" })
      } else {
        slots_booked[slotDate].push(slotTime)
      }
    } else {
      slots_booked[slotDate] = []
      slots_booked[slotDate].push(slotTime)
    }
    const userData = await userModel.findById(userId).select('-password')
    delete docData.slots_booked
    const appointments = {
      userId,
      docId,
      userData,
      docData,
      amount:docData.fees,
      slotDate,
      slotTime,
      date: Date.now(),
    }
    const newAppointment = new appointmentModel(appointments)
    await newAppointment.save()
    //save slots data in docdata
    await doctorModel.findByIdAndUpdate(docId, { slots_booked })
    res.json({ success: true, message: "Appointment booked successfully" });

    
  } catch (error) {
    console.log("Update Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

//API to get the userappointments from frontend myappoint

const listAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointments = await appointmentModel.find({ userId });

    res.json({success:true,appointments})
  } catch (error) {
    console.log("Update Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }

}
// Cancel the appointment

const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body
    const userId = req.user.id;
    const appointmentData = await appointmentModel.findById(appointmentId)
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "You are not authorized to cancel this appointment" })
    }
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
//API to make payment using razorpay
// const razorpayInstance = new razorpay(
//   {
//     key_id: "",
//     key_secret:""
//   }
// )
// const paymentRazorpay = async1384(req, res)=> {

// }

export { registerUser, loginUser, getUserProfile, updateUserProfile , bookAppointment , listAppointment, cancelAppointment };


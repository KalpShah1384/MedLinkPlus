import express from 'express';
import authUser from '../middleware/authUser.js';
import VitalSigns from '../models/vitalSignsModel.js';
import Medication from '../models/medicationModel.js';
import appointmentModel from '../models/appointment.js';

const router = express.Router();

// Get user's vital signs history
router.get('/vitalsigns/:userId', authUser, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Get last 30 days of vital signs data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const vitalSigns = await VitalSigns.find({
      userId,
      date: { $gte: thirtyDaysAgo }
    })
    .sort('date')
    .lean();

    // Format the data for the frontend
    const formattedData = {
      bloodPressure: vitalSigns.map(sign => ({
        date: sign.date.toISOString().split('T')[0],
        systolic: sign.bloodPressure.systolic,
        diastolic: sign.bloodPressure.diastolic
      })),
      heartRate: vitalSigns.map(sign => ({
        date: sign.date.toISOString().split('T')[0],
        rate: sign.heartRate
      })),
      bloodSugar: vitalSigns.map(sign => ({
        date: sign.date.toISOString().split('T')[0],
        level: sign.bloodSugar
      })),
    };

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's medication history
router.get('/medication/:userId', authUser, async (req, res) => {
  try {
    const userId = req.params.userId;
    const medications = await Medication.find({ userId })
      .sort('-startDate')
      .lean();

    res.json(medications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's appointments
router.get('/appointments/:userId', authUser, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Get upcoming appointments (next 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    // Get appointments directly from the model
    const appointments = await appointmentModel.find({
      userId,
      cancel: false,
      date: { $gte: new Date(), $lte: thirtyDaysFromNow }
    }).lean();

    // Format appointments
    const formattedAppointments = appointments.map(appointment => ({
      id: appointment._id,
      doctorName: `${appointment.docData.firstName} ${appointment.docData.lastName}`,
      date: appointment.slotDate,
      time: appointment.slotTime,
      status: appointment.cancel ? 'Cancelled' : 'Upcoming',
      specialty: appointment.docData.specialty
    }));

    res.json(formattedAppointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
});

export default router;

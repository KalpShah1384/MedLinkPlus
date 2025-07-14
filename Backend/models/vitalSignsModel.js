import mongoose from 'mongoose';

const vitalSignSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  bloodPressure: {
    systolic: {
      type: Number,
      required: true
    },
    diastolic: {
      type: Number,
      required: true
    }
  },
  heartRate: {
    type: Number,
    required: true
  },
  bloodSugar: {
    type: Number,
    required: true
  },
  notes: {
    type: String
  }
});

const VitalSigns = mongoose.model('VitalSigns', vitalSignSchema);

export default VitalSigns;

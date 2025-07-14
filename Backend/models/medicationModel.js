import mongoose from 'mongoose';

const medicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  dosage: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  takenCount: {
    type: Number,
    default: 0
  },
  totalCount: {
    type: Number,
    required: true
  },
  notes: {
    type: String
  }
});

const Medication = mongoose.model('Medication', medicationSchema);

export default Medication;

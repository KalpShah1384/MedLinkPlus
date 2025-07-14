import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text'
  },
  attachment: {
    url: String,
    filename: String,
    contentType: String
  }
}, {
  timestamps: true
});

// Index for efficient querying
messageSchema.index({ senderId: 1, receiverId: 1, timestamp: -1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;

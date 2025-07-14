import express from 'express';
import authUser from '../middleware/authUser.js';
import Message from '../models/messageModel.js';
import User from '../models/userModel.js';

const router = express.Router();

// Get messages between two users
router.get('/conversation/:otherUserId', authUser, async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const userId = req.user.id;

    // Get messages between the two users
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId }
      ]
    })
    .sort({ timestamp: 1 })
    .populate('senderId receiverId', 'name email');

    // Mark messages as read if they were sent to the current user
    await Message.updateMany({
      receiverId: userId,
      senderId: otherUserId,
      read: false
    }, { read: true });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// Send a new message
router.post('/', authUser, async (req, res) => {
  try {
    const { receiverId, content, type, attachment } = req.body;
    const userId = req.user.id;

    const message = new Message({
      senderId: userId,
      receiverId,
      content,
      type,
      attachment
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message' });
  }
});

// Get all conversations for a user
router.get('/conversations', authUser, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get unique users that have messaged with the current user
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: userId },
            { receiverId: userId }
          ]
        }
      },
      {
        $group: {
          _id: {
            otherUser: {
              $cond: [
                { $eq: ['$senderId', userId] },
                '$receiverId',
                '$senderId'
              ]
            },
            latest: { $max: '$timestamp' }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id.otherUser',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $sort: { '_id.latest': -1 }
      },
      {
        $project: {
          _id: 0,
          userId: '$_id.otherUser',
          name: '$user.name',
          email: '$user.email',
          latestMessage: '$_id.latest'
        }
      }
    ]);

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversations' });
  }
});

export default router;

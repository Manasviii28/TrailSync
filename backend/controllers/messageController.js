import Message from '../models/Message.js';
import User from '../models/User.js';
import Profile from '../models/Profile.js';

// @desc    Get all active message conversations for logged in user
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Find all messages where user is sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .sort({ createdAt: -1 })
      .populate('senderId', 'name email')
      .populate('receiverId', 'name email');

    // Group messages by partner user ID
    const conversationsMap = {};

    for (const msg of messages) {
      const isSender = msg.senderId._id.toString() === userId.toString();
      const partner = isSender ? msg.receiverId : msg.senderId;

      if (!partner) continue;

      const partnerIdStr = partner._id.toString();

      if (!conversationsMap[partnerIdStr]) {
        conversationsMap[partnerIdStr] = {
          user: {
            _id: partner._id,
            name: partner.name,
            email: partner.email,
          },
          lastMessage: {
            content: msg.content,
            createdAt: msg.createdAt,
            isSender,
          },
        };
      }
    }

    // Attach profile avatars for conversation partners
    const partnerIds = Object.keys(conversationsMap);
    const profiles = await Profile.find({ userId: { $in: partnerIds } });
    const profileMap = {};
    profiles.forEach((p) => {
      profileMap[p.userId.toString()] = p;
    });

    const conversations = partnerIds.map((id) => ({
      ...conversationsMap[id],
      user: {
        ...conversationsMap[id].user,
        avatar: profileMap[id]?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
    }));

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get message thread with specific user
// @route   GET /api/messages/:userId
// @access  Private
export const getMessages = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const targetUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: targetUserId },
        { senderId: targetUserId, receiverId: currentUserId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message to a user
// @route   POST /api/messages/:userId
// @access  Private
export const sendMessage = async (req, res, next) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.userId;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message content cannot be empty' });
    }

    const receiverExists = await User.findById(receiverId);
    if (!receiverExists) {
      return res.status(404).json({ message: 'Recipient user not found' });
    }

    const message = await Message.create({
      senderId,
      receiverId,
      content: content.trim(),
    });

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    next(error);
  }
};

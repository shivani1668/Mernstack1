import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import Story from "../models/story.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // 1. Find all users except the logged-in one
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    // 2. Map through users and find the actual latest message timestamp
    const usersWithLastMessage = await Promise.all(
      users.map(async (user) => {
        const lastMessage = await Message.findOne({
          $or: [
            { senderId: loggedInUserId, receiverId: user._id },
            { senderId: user._id, receiverId: loggedInUserId },
          ],
        }).sort({ createdAt: -1 });

        return {
          ...user.toObject(),
          lastMessageDate: lastMessage ? lastMessage.createdAt : new Date(0),
        };
      })
    );

    // 3. Sort by the actual timestamp (Newest on top)
    usersWithLastMessage.sort((a, b) => {
        const dateA = new Date(a.lastMessageDate).getTime();
        const dateB = new Date(b.lastMessageDate).getTime();
        return dateB - dateA;
    });

    res.status(200).json(usersWithLastMessage);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    await Message.deleteMany({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json({ message: "Messages deleted successfully" });
  } catch (error) {
    console.log("Error in deleteMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getStories = async (req, res) => {
  try {
    const stories = await Story.find().populate("owner", "fullName profilePic");
    res.status(200).json(stories);
  } catch (error) {
    console.log("Error in getStories controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const postStory = async (req, res) => {
  try {
    const { content, image } = req.body;
    const ownerId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newStory = new Story({
      owner: ownerId,
      content,
      image: imageUrl,
    });

    await newStory.save();

    const populatedStory = await newStory.populate("owner", "fullName profilePic");
    res.status(201).json(populatedStory);
  } catch (error) {
    console.log("Error in postStory controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

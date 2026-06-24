import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import Story from "../models/story.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ fullName, email, password: hashedPassword });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });
    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profilePic) return res.status(400).json({ message: "Profile pic is required" });
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    await Message.deleteMany({ $or: [{ senderId: userId }, { receiverId: userId }] });
    await Story.deleteMany({ owner: userId });
    await User.findByIdAndDelete(userId);
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.log("Error in deleteAccount controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Current password is incorrect" });
    if (newPassword.length < 6) return res.status(400).json({ message: "New password must be at least 6 characters" });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log("Error in updatePassword controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log("Forgot password request for:", email);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    console.log("Reset token generated and saved for user.");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS?.replace(/\s/g, ""),
      },
      debug: true, // show debug output
      logger: true, // log information in console
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    console.log("Generated reset URL:", resetUrl);

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click here to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`,
    };

    console.log("Attempting to send email with debug logs enabled...");
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully! Message ID:", info.messageId);

    res.status(200).json({ message: "Reset email sent" });
  } catch (error) {
    console.error("Forgot Password Error Detail:", error);
    res.status(500).json({ message: "Error sending email. Please check server logs." });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: "Token invalid or expired" });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

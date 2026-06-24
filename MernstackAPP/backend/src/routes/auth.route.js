import express from "express";
import { signup, login, logout, updateProfile, checkAuth, deleteAccount, updatePassword } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { forgotPassword, resetPassword } from "../controllers/auth.controller.js";



const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.put("/update-profile", protectRoute, updateProfile);
router.put("/update-password", protectRoute, updatePassword);

router.get("/check", protectRoute, checkAuth);
router.delete("/delete", protectRoute, deleteAccount);

export default router;

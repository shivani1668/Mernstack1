import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUsersForSidebar, getMessages, sendMessage, getStories, postStory, deleteMessages } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/stories/all", protectRoute, getStories);
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);
router.post("/stories/post", protectRoute, postStory);

router.delete("/delete/:id", protectRoute, deleteMessages);

export default router;

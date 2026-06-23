import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useStoryStore = create((set, get) => ({
  stories: [],
  isStoriesLoading: false,
  isPostingStory: false,

  getStories: async () => {
    set({ isStoriesLoading: true });
    try {
      const res = await axiosInstance.get("/messages/stories/all");
      set({ stories: res.data });
    } catch (error) {
      console.log("Error in getStories:", error);
    } finally {
      set({ isStoriesLoading: false });
    }
  },

  postStory: async (storyData) => {
    set({ isPostingStory: true });
    try {
      const res = await axiosInstance.post("/messages/stories/post", storyData);
      set({ stories: [res.data, ...get().stories] });
      toast.success("Story posted successfully!");
    } catch (error) {
      toast.error("Failed to post story");
    } finally {
      set({ isPostingStory: false });
    }
  },
}));

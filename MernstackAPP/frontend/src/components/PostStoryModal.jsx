import { useState, useRef } from "react";
import { useStoryStore } from "../stores/useStoryStore";
import { Image, Send, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const PostStoryModal = ({ onClose }) => {
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { postStory, isPostingStory } = useStoryStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !imagePreview) return;

    await postStory({
      content: content.trim(),
      image: imagePreview,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-base-100 rounded-2xl p-6 w-full max-w-md shadow-xl border border-base-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Post a Story</h2>
          <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <textarea
              className="textarea textarea-bordered h-24 w-full"
              placeholder="What's on your mind? (Quote or Link)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>

          {imagePreview && (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border border-base-300"
              />
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute top-2 right-2 btn btn-circle btn-xs btn-error"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              type="button"
              className="btn btn-outline btn-sm gap-2"
              onClick={() => fileInputRef.current.click()}
            >
              <Image size={18} />
              Add Image
            </button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />

            <button
              type="submit"
              className="btn btn-primary btn-sm gap-2"
              disabled={isPostingStory || (!content.trim() && !imagePreview)}
            >
              {isPostingStory ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Send size={18} />
              )}
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostStoryModal;

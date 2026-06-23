import { X } from "lucide-react";

const StoryModal = ({ story, onClose }) => {
  if (!story) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-base-100 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="absolute top-0 inset-x-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent z-10">
          <div className="flex items-center gap-3 text-white">
            <img
              src={story.owner.profilePic || "/avatar.png"}
              alt={story.owner.fullName}
              className="size-10 rounded-full border-2 border-primary object-cover"
            />
            <span className="font-bold">{story.owner.fullName}</span>
          </div>
          <button onClick={onClose} className="btn btn-circle btn-sm btn-ghost text-white">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="min-h-[400px] flex items-center justify-center bg-zinc-900">
          {story.image ? (
            <img src={story.image} alt="Story" className="w-full h-auto max-h-[70vh] object-contain" />
          ) : (
            <div className="p-12 text-center">
              <p className="text-2xl font-medium text-white italic">"{story.content}"</p>
            </div>
          )}
        </div>

        {/* Caption for image stories */}
        {story.image && story.content && (
          <div className="p-4 bg-zinc-900 text-center">
             <p className="text-white">{story.content}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryModal;

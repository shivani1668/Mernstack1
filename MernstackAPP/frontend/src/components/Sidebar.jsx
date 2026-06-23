import { useEffect, useState } from "react";
import { useChatStore } from "../stores/useChatStore";
import { useAuthStore } from "../stores/useAuthStore";
import { useStoryStore } from "../stores/useStoryStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Plus } from "lucide-react";
import StoryModal from "./StoryModal";
import PostStoryModal from "./PostStoryModal";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { authUser, onlineUsers } = useAuthStore();
  const { getStories, stories } = useStoryStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [isPostModalOpen, setIsPostStoryModalOpen] = useState(false);

  useEffect(() => {
    getUsers();
    getStories();
  }, [getUsers, getStories]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  const handleStoryClick = (userId, e) => {
    e.stopPropagation();
    const userStory = stories.find((s) => s.owner._id === userId);
    if (userStory) {
      setSelectedStory(userStory);
    }
  };

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span className="font-medium hidden lg:block">Contacts</span>
          </div>
          <button
            onClick={() => setIsPostStoryModalOpen(true)}
            className="btn btn-ghost btn-circle btn-sm"
            title="Post a story"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({Math.max(0, onlineUsers.length - 1)} online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => {
          const hasStory = stories.some((s) => s.owner._id === user._id);

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
              `}
            >
              <div
                className="relative mx-auto lg:mx-0"
                onClick={(e) => hasStory && handleStoryClick(user._id, e)}
              >
                <div className={`rounded-full p-0.5 ${hasStory ? "ring-2 ring-primary animate-pulse cursor-pointer" : ""}`}>
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.fullName}
                    className="size-12 object-cover rounded-full"
                    onError={(e) => {
                      e.target.src = "/avatar.png";
                    }}
                  />
                </div>
                {onlineUsers.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500
                    border-2 border-zinc-900 rounded-full"
                  />
                )}
              </div>

              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No users found</div>
        )}
      </div>

      {selectedStory && (
        <StoryModal story={selectedStory} onClose={() => setSelectedStory(null)} />
      )}

      {isPostModalOpen && (
        <PostStoryModal onClose={() => setIsPostStoryModalOpen(false)} />
      )}
    </aside>
  );
};
export default Sidebar;

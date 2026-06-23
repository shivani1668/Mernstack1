import { X, Trash2 } from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";
import { useChatStore } from "../stores/useChatStore";
import Avatar from "./Avatar";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, deleteMessages } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const handleClearChat = () => {
    if (window.confirm(`Are you sure you want to clear your chat history with ${selectedUser.fullName}?`)) {
      deleteMessages(selectedUser._id);
    }
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar user={selectedUser} size="size-10" />

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Clear Chat Button */}
          <button
            onClick={handleClearChat}
            className="btn btn-ghost btn-circle btn-sm text-error"
            title="Clear Chat"
          >
            <Trash2 size={18} />
          </button>

          {/* Close button */}
          <button
            onClick={() => setSelectedUser(null)}
            className="btn btn-ghost btn-circle btn-sm"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;

import { useChatStore } from "../stores/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden relative">
            {/* Sidebar - Always visible on desktop, hidden on mobile if chat selected */}
            <div className={`
              ${selectedUser ? "hidden md:block" : "block"}
              h-full w-full md:w-auto
            `}>
              <Sidebar />
            </div>

            {/* Chat View - Hidden on mobile if no user selected */}
            <div className={`
              flex-1 h-full
              ${!selectedUser ? "hidden md:flex" : "flex"}
            `}>
              {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;

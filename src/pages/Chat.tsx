
import { Dashboard } from "@/components/layout/Dashboard";
import { TeamChat } from "@/components/chat/TeamChat";

const Chat = () => {
  return (
    <Dashboard title="Team Chat">
      <div className="grid h-[calc(100vh-9rem)] grid-cols-1">
        <TeamChat />
      </div>
    </Dashboard>
  );
};

export default Chat;

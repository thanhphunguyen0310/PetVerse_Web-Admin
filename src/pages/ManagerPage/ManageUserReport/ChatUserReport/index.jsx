// ChatUserReport.jsx
import { useState } from "react";
import List from "../../../../components/Chat/List";
import "./Chat.css";
import ChatContent from "../../../../components/Chat/ChatContent";

const ChatUserReport = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedSender, setSelectedSender] = useState(null);

  const handleSelectChat = (chatId, sender) => {
    setSelectedChat(chatId);
    setSelectedSender(sender);
  };
  return (
    <div className="chat-container">
      <List onSelectChat={handleSelectChat} />
      {selectedChat ? (
        <ChatContent chatId={selectedChat} sender={selectedSender} />
      ) : (
        <div className="no-chat-selected">
        <div className="no-chat-content">
          <img
            src="https://cdn-icons-png.flaticon.com/512/471/471664.png" 
            alt="Chat Illustration"
            className="no-chat-image"
          />
          <p className="no-chat-text">Hãy chọn một cuộc trò chuyện để bắt đầu!</p>
        </div>
      </div>
      )}
    </div>
  );
};

export default ChatUserReport;
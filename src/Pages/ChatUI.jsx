import { useState, useEffect, useContext, useRef } from "react";
import SocketContext from "../Sockets/socketContex.js";
import Loader from "../Components/Loader.jsx";

const ChatUI = ({ user }) => {
  const userId = useRef(sessionStorage.getItem("userId"));
  const socket = useContext(SocketContext);

  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 1. Get All Chats
  useEffect(() => {
    if (!userId.current) return;
    setLoading(true);

    socket.emit("getAllChats", { userId: userId.current });

    const handleAllChats = (data) => {
      setChats(data);
      setLoading(false);
    };

    const handleChatError = (err) => {
      console.error(err.message);
      setLoading(false);
    };

    socket.on("allChats", handleAllChats);
    socket.on("chatError", handleChatError);

    return () => {
      socket.off("allChats", handleAllChats);
      socket.off("chatError", handleChatError);
    };
  }, [socket]);

  // 2. Handle Real-Time Incoming Messages
  useEffect(() => {
    const handleNewMessage = (message) => {
      if (message.chatId === activeChat) {
        setMessages((prev) => [...prev, message]);
      }

      // Move chat to top if it's in the chat list
      setChats((prev) => {
        const index = prev.findIndex((c) => c.chatId === message.chatId);
        if (index === -1) return prev;

        const updated = [...prev];
        const [chatToMove] = updated.splice(index, 1);
        updated.unshift(chatToMove);
        return updated;
      });
    };

    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, activeChat]);

  // 3. Join Chat + Fetch Messages When User is Passed as Prop
  useEffect(() => {
    if (!user || !userId.current) return;

    socket.emit("joinChat", {
      userId: userId.current,
      otherUserId: user._id,
    });

    const handleChatJoined = (chatData) => {
      setActiveChat(chatData.chatId);
      setOtherUser(user);
      setMessages(chatData.messages || []); // Initialize messages correctly

      setChats((prevChats) => {
        const existingIndex = prevChats.findIndex(
          (c) => c.chatId.toString() === chatData.chatId.toString()
        );
        if (existingIndex !== -1) {
          const updated = [...prevChats];
          const [existingChat] = updated.splice(existingIndex, 1);
          updated.unshift(existingChat);
          return updated;
        } else {
          return [chatData, ...prevChats];
        }
      });
    };

    socket.on("chatJoined", handleChatJoined);
    socket.on("error", console.error);

    return () => {
      socket.off("chatJoined", handleChatJoined);
      socket.off("error", console.error);
    };
  }, [user, socket]);

  // 4. Handle Chat Click
  useEffect(() => {
    const handleMessages = (msgs) => {
      setMessages(msgs);
    };

    socket.on("chatMessages", handleMessages);

    return () => {
      socket.off("chatMessages", handleMessages);
    };
  }, [socket]);

  const handleChatClick = (chat) => {
    if (activeChat === chat.chatId) return;

    setActiveChat(chat.chatId);
    setOtherUser(chat.oppositeUser);
    setMessages([]); // temporary clear to avoid flicker

    // Join room
    socket.emit("joinChat", {
      userId: userId.current,
      otherUserId: chat.oppositeUser._id,
    });

    // Fetch messages explicitly
    socket.emit("getMessages", { chatId: chat.chatId });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeChat) return;

    const newMessage = {
      _id: `msg-${Date.now()}`, // Temporary ID
      chatId: activeChat,
      sender: { _id: userId.current },
      content: messageInput,
      deliveredToPerson: otherUser._id,
      createdAt: new Date().toISOString(),
    };

    // Emit message
    socket.emit("sendMessage", newMessage);

    setMessageInput(""); // Clear input after sending
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {loading && <Loader />}

      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 bg-indigo-600 text-white">
          <h1 className="text-2xl font-bold">Messages</h1>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.chatId}
              onClick={() => handleChatClick(chat)}
              className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                activeChat === chat.chatId ? "bg-indigo-50" : ""
              }`}
            >
              <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-800 font-bold">
                {chat.oppositeUser?.fullName?.charAt(0)}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm text-gray-900">
                    {chat.oppositeUser?.fullName}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {chat.lastMessage
                      ? formatTime(chat.lastMessage.createdAt)
                      : ""}
                  </span>
                </div>
                <p className="text-xs truncate text-gray-500">
                  {chat.lastMessage?.content || "No messages yet"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-white flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-800 font-bold text-lg">
                {otherUser?.fullName?.charAt(0)}
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                {otherUser?.fullName}
              </h2>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.sender._id === userId.current ||
                      message.sender._id === undefined
                        ? "justify-end"
                        : "items-start"
                    }`}
                  >
                    {(message.sender._id !== userId.current ||
                      message.sender._id === undefined) && (
                      <div className="h-8 w-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-800 font-bold text-xs mr-2">
                        {otherUser?.fullName?.charAt(0)}
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-lg shadow-sm max-w-xs ${
                        message.sender._id === userId.current ||
                        message.sender._id === undefined
                          ? "bg-indigo-600 text-white rounded-tr-none"
                          : "bg-white text-black rounded-tl-none"
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {formatTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  className="flex-1 border rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatUI;

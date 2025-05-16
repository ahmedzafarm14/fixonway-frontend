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

  useEffect(() => {
    if (!userId) return;

    socket.emit("getAllChats", { userId: userId.current });

    socket.on("allChats", (data) => {
      setChats(data);
      setLoading(false);
    });
    console.log(chats);
    socket.on("chatError", (err) => {
      console.error(err.message);
      setLoading(false);
    });

    return () => {
      socket.off("allChats");
      socket.off("chatError");
    };
  }, []);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  //Sidebar chat click
  const handleChatClick = (chat) => {
    if (activeChat === chat.chatId) return;
    const otherParticipant = chat.oppositeUser;
    setActiveChat(chat.chatId);
    setOtherUser(otherParticipant);
    setMessages(chat.messages);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeChat) return;

    const newMessage = {
      _id: `msg-${Date.now()}`,
      chatId: activeChat,
      sender: userId,
      content: messageInput,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessageInput("");
  };

  useEffect(() => {
    if (user) {
      socket.emit("joinChat", {
        userId: userId.current,
        otherUserId: user._id,
      });
      socket.on("chatJoined", (chatData) => {
        console.log("Successfully joined chat with ID:", chatData);
        setActiveChat(chatData.chatId);
        setOtherUser(user);
        setMessages(chatData.messages);
        setChats((prevChats) => {
          const existingIndex = prevChats.findIndex(
            (c) => c.chatId.toString() === chatData.chatId.toString()
          );

          if (existingIndex !== -1) {
            // Move existing chat to index 1
            const updatedChats = [...prevChats];
            const [existingChat] = updatedChats.splice(existingIndex, 1);
            updatedChats.splice(1, 0, existingChat);
            return updatedChats;
          } else {
            // Insert new chat at index 0
            return [chatData, ...prevChats];
          }
        });

        socket.on("error", (message) => {
          console.error(message);
        });
        return () => {
          socket.off("chatJoined");
          socket.off("error");
        };
      });
    }
  }, []);
  //Chat Array
  /*  [
    {
      chatId: new ObjectId('682768c7dfe7cd4ca144c072'),
      oppositeUser: {
        _id: new ObjectId('682367566dbd2cbacce63f04'),
        fullName: 'Ahmad Zafar',
        email: 'ahmedzafarm14@gmail.com'
      },
      lastMessage: null,
      messages: []
    }
  ]*/
  return (
    <div className="flex h-screen bg-gray-100">
      {loading && <Loader />}
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 bg-indigo-600 text-white">
          <h1 className="text-2xl font-bold">Messages</h1>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => {
            const otherParticipant = chat.oppositeUser;

            return (
              <div
                key={chat.chatId}
                onClick={() => handleChatClick(chat)}
                className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                  activeChat === chat.chatId ? "bg-indigo-50" : ""
                }`}
              >
                <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-800 font-bold">
                  {otherParticipant?.fullName?.charAt(0)}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm text-gray-900">
                      {otherParticipant?.fullName}
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
            );
          })}
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
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${
                      message.sender === userId ? "justify-end" : "items-start"
                    }`}
                  >
                    {message.sender !== userId && (
                      <div className="h-8 w-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-800 font-bold text-xs mr-2">
                        {otherUser?.fullName?.charAt(0)}
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-lg shadow-sm max-w-xs ${
                        message.sender === userId
                          ? "bg-indigo-600 text-white rounded-tr-none"
                          : "bg-white rounded-tl-none"
                      }`}
                    >
                      <p>{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === userId
                            ? "text-indigo-200"
                            : "text-gray-500"
                        }`}
                      >
                        {formatTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 p-2 text-black border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 ml-2 transform hover:scale-110 transition-transform duration-200"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
            <div className="max-w-md text-center p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Select a chat to start messaging
              </h2>
              <p className="text-gray-500 mb-6">
                Choose from your existing conversations or start a new one.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatUI;

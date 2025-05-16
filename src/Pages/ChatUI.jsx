import { useState, useContext, useEffect, useRef } from "react";
import SocketContext from "../Sockets/socketContex.js";
import axios from "axios";

const ChatUI = ({ user }) => {
  const socket = useContext(SocketContext);
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [otherUser, setOtherUser] = useState(user || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    socket.on("chatJoined", ({ chatId }) => {
      setActiveChat(chatId);
      fetchMessages(chatId);
    });

    socket.on("chatMessages", (messages) => {
      setMessages(messages);
      scrollToBottom();
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
      setError("Connection error. Please refresh the page.");
    });

    return () => {
      socket.off("newMessage");
      socket.off("chatJoined");
      socket.off("chatMessages");
      socket.off("error");
    };
  }, [socket]);

  useEffect(() => {
    const initializeChat = async () => {
      if (!user || !socket) return;

      try {
        setLoading(true);
        setError(null);
        setOtherUser(user);

        await fetchUserChats();

        const existingChat = chats.find((chat) =>
          chat.participants.some((p) => p._id === user._id)
        );

        if (existingChat) {
          setActiveChat(existingChat._id);
          fetchMessages(existingChat._id);
        } else {
          socket.emit("joinChat", {
            userId: sessionStorage.getItem("userId"),
            otherUserId: user._id,
          });
        }
      } catch (err) {
        console.error("Chat initialization error:", err);
        setError("Failed to initialize chat");
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, [user, socket]);

  const fetchUserChats = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/chats`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      setChats(response.data || []);
    } catch (err) {
      console.error("Error fetching chats:", err);
      setError("Failed to load chats");
    }
  };

  const fetchMessages = async (chatId) => {
    if (!socket) return;
    try {
      setLoading(true);
      socket.emit("getMessages", { chatId });
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleChatClick = (chat) => {
    if (activeChat === chat._id) return;
    const userId = sessionStorage.getItem("userId");
    const otherParticipant = chat.participants.find((p) => p._id !== userId);

    setActiveChat(chat._id);
    setOtherUser(otherParticipant);
    fetchMessages(chat._id);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !socket || !activeChat) return;

    const newMessage = {
      chatId: activeChat,
      senderId: sessionStorage.getItem("userId"),
      content: messageInput,
      messageType: "text",
    };

    socket.emit("sendMessage", newMessage);
    setMessageInput("");
  };

  const handleDeleteChat = () => {
    setActiveChat(null);
    setMenuOpen(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading chat...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 bg-indigo-600 text-white">
          <h1 className="text-2xl font-bold">Messages</h1>
        </div>

        <div className="p-3 bg-gray-50">
          <div className="relative">
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full p-2 pl-10 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-3 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="flex border-b border-gray-200">
          <button className="flex-1 py-3 font-medium text-sm text-indigo-600 border-b-2 border-indigo-600">
            Chats
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.length > 0 ? (
            chats.map((chat) => {
              const userId = sessionStorage.getItem("userId");
              const otherParticipant = chat.participants.find(
                (p) => p._id !== userId
              );

              return (
                <div
                  key={chat._id}
                  onClick={() => handleChatClick(chat)}
                  className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                    activeChat === chat._id ? "bg-indigo-50" : ""
                  }`}
                >
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-800 font-bold">
                      {otherParticipant?.fullName?.charAt(0) || "U"}
                    </div>
                    {chat.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm text-gray-900">
                        {otherParticipant?.fullName || "User"}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {new Date(chat.updatedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-xs truncate text-gray-500">
                      {chat.lastMessage?.content || "No messages yet"}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-gray-500 text-sm text-center">
              No chats available.
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            {/* Header */}
            {/* ... unchanged ... */}

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${
                      message.sender === sessionStorage.getItem("userId")
                        ? "justify-end"
                        : "items-start"
                    }`}
                  >
                    {message.sender !== sessionStorage.getItem("userId") && (
                      <div className="h-8 w-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-800 font-bold text-xs mr-2">
                        {otherUser?.fullName?.charAt(0) || "U"}
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-lg shadow-sm max-w-xs ${
                        message.sender === sessionStorage.getItem("userId")
                          ? "bg-indigo-600 text-white rounded-tr-none"
                          : "bg-white rounded-tl-none"
                      }`}
                    >
                      <p>{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === sessionStorage.getItem("userId")
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
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
                {user
                  ? "Initializing chat..."
                  : "Select a chat to start messaging"}
              </h2>
              <p className="text-gray-500 mb-6">
                {user
                  ? "Please wait while we connect you"
                  : "Choose from your existing conversations or start a new one"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatUI;

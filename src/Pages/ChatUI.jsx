import { useState } from "react";

const ChatUI = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "John Doe",
      content: "Hey there! How are you doing?",
      time: "10:30 AM",
      unread: false,
    },
    {
      id: 2,
      sender: "Sarah Smith",
      content: "Meeting at 2 PM tomorrow",
      time: "9:15 AM",
      unread: true,
    },
    {
      id: 3,
      sender: "Team Group",
      content: "Alex: I finished the design mockups",
      time: "Yesterday",
      unread: false,
    },
  ]);

  const [activeChat, setActiveChat] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleChatClick = (chatId) => {
    setActiveChat(chatId);
    setMessages(
      messages.map((msg) =>
        msg.id === chatId ? { ...msg, unread: false } : msg
      )
    );
  };

  const handleDeleteChat = () => {
    setMessages(messages.filter((msg) => msg.id !== activeChat));
    setActiveChat(null);
    setMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-indigo-600 text-white">
          <h1 className="text-2xl font-bold">Messages</h1>
        </div>

        {/* Search */}
        <div className="p-3 bg-gray-50">
          <div className="relative">
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full p-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button className="flex-1 py-3 font-medium text-sm text-indigo-600 border-b-2 border-indigo-600">
            Chats
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              onClick={() => handleChatClick(message.id)}
              className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                activeChat === message.id ? "bg-indigo-50" : ""
              } ${message.unread ? "font-semibold" : ""}`}
            >
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-800 font-bold">
                  {message.sender.charAt(0)}
                </div>
                {message.unread && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-center">
                  <h3
                    className={`text-sm ${
                      message.unread ? "text-gray-900" : "text-gray-700"
                    }`}
                  >
                    {message.sender}
                  </h3>
                  <span className="text-xs text-gray-500">{message.time}</span>
                </div>
                <p
                  className={`text-xs truncate ${
                    message.unread ? "text-gray-800" : "text-gray-500"
                  }`}
                >
                  {message.content}
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
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white flex items-center relative">
              <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-800 font-bold">
                {messages.find((m) => m.id === activeChat)?.sender.charAt(0)}
              </div>
              <div className="ml-3">
                <h2 className="font-semibold text-gray-900">
                  {messages.find((m) => m.id === activeChat)?.sender}
                </h2>
              </div>

              {/* 3 Dots Dropdown */}
              <div className="ml-auto relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
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
                      d="M12 5v.01M12 12v.01M12 19v.01"
                    />
                  </svg>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <button
                      onClick={handleDeleteChat}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      Delete Chat
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="h-8 w-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-800 font-bold text-xs mr-2">
                    {messages
                      .find((m) => m.id === activeChat)
                      ?.sender.charAt(0)}
                  </div>
                  <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-xs">
                    <p>Hey there! How's it going?</p>
                    <p className="text-xs text-gray-500 mt-1">10:30 AM</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="bg-indigo-600 text-white p-3 rounded-lg rounded-tr-none shadow-sm max-w-xs">
                    <p>I'm doing great! Just working on some projects.</p>
                    <p className="text-xs text-indigo-200 mt-1">10:32 AM</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="h-8 w-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-800 font-bold text-xs mr-2">
                    {messages
                      .find((m) => m.id === activeChat)
                      ?.sender.charAt(0)}
                  </div>
                  <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-xs">
                    <p>That's awesome! What kind of projects?</p>
                    <p className="text-xs text-gray-500 mt-1">10:33 AM</p>
                  </div>
                </div>

                <div className="flex justify-end animate-pulse">
                  <div className="bg-gray-200 p-3 rounded-lg rounded-tr-none shadow-sm max-w-xs flex items-center">
                    <div
                      className="h-2 w-2 bg-gray-400 rounded-full mr-1 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 bg-gray-400 rounded-full mr-1 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 ml-2 transform hover:scale-110 transition-transform duration-200">
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
              <div className="h-20 w-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-10 w-10 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Select a chat to start messaging
              </h2>
              <p className="text-gray-500 mb-6">
                Choose from your existing conversations or start a new one
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatUI;

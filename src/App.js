import React, { useState, useRef, useEffect } from "react";
import RouteLinks from "./Routes/routes.js";
import { io } from "socket.io-client";
import SocketContext from "./Sockets/socketContex.js";

function App() {
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null); // To persist socket instance across re-renders
  useEffect(() => {
    // Establish the Socket.IO connection
    socketRef.current = io(`${process.env.REACT_APP_BACKEND_BASE_URL}`);
    // Set the socket state once the connection is established
    setSocket(socketRef.current);
    // Clean up the socket connection when the component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []); // Empty dependency array ensures this runs only once after the initial render
  return (
    <div className="App">
      <SocketContext.Provider value={socket}>
        <RouteLinks />
      </SocketContext.Provider>
    </div>
  );
}

export default App;

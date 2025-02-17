import React, { createContext, useContext, useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [stompClient, setStompClient] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Map());  // Track online users
  const [typingStatus, setTypingStatus] = useState(new Map()); // Track typing status

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/chat");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Connected to WebSocket");

        // Subscribe to online status updates
        client.subscribe("/topic/online-status", (message) => {
          const { userId, isOnline } = JSON.parse(message.body);
          setOnlineUsers((prev) => new Map(prev).set(userId, isOnline));
        });

        // Subscribe to typing status updates (per user)
        client.subscribe("/user/queue/typing", (message) => {
          const { senderId, typingStatus } = JSON.parse(message.body);
          setTypingStatus((prev) => new Map(prev).set(senderId, typingStatus));
        });
      },
      onDisconnect: () => console.log("Disconnected from WebSocket"),
    });

    client.activate();
    setStompClient(client);

    return () => {
      if (client.connected) {
        client.deactivate();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ stompClient, onlineUsers, typingStatus }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);

import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchMessagesBetweenUsers, sendMessage } from "../Routers/api"; // Removed readReceipt
import { useWebSocket } from "../Config/WebsocketProvider";
import { Box, TextField, List, ListItem, ListItemText, Typography, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const ChatPage = () => {
  const location = useLocation();
  const { senderId, receiverId, username } = location.state || {};

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const { stompClient, onlineUsers, typingStatus } = useWebSocket();

  useEffect(() => {
    if (!senderId || !receiverId) {
      console.error("Missing senderId or receiverId.");
      return;
    }

    const loadMessages = async () => {
      const fetchedMessages = await fetchMessagesBetweenUsers(senderId, receiverId);
      console.log("fetched messages", fetchedMessages);
      setMessages(fetchedMessages.data);
    };
    loadMessages();
  }, [senderId, receiverId]);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Subscribe to WebSocket events
  useEffect(() => {
    if (!stompClient || !stompClient.connected) return;
    
    const subscriptions = [];

    // Subscribe to online status updates
    subscriptions.push(
      stompClient.subscribe("/topic/online-status", (message) => {
        const { userId, isOnline } = JSON.parse(message.body);
        onlineUsers.set(userId, isOnline);
      })
    );

    // Subscribe to private typing notifications
    subscriptions.push(
      stompClient.subscribe("/user/queue/typing", (message) => {
        const { senderId, typingStatus } = JSON.parse(message.body);
        typingStatus.set(senderId, typingStatus);
      })
    );

    return () => subscriptions.forEach((sub) => sub.unsubscribe());
  }, [stompClient]);

  // Notify online status when user enters or leaves
  useEffect(() => {
    if (stompClient?.connected && senderId) {
      stompClient.publish({
        destination: "/app/online-status",
        body: JSON.stringify({ userId: senderId, isOnline: true }),
      });

      return () => {
        stompClient.publish({
          destination: "/app/online-status",
          body: JSON.stringify({ userId: senderId, isOnline: false }),
        });
      };
    }
  }, [stompClient, senderId]);

  // Handle typing status
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (stompClient?.connected) {
      stompClient.publish({
        destination: "/app/typing-status",
        body: JSON.stringify({ senderId, receiverId, isTyping: e.target.value.length > 0 }),
      });
    }
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (newMessage.trim() && senderId && receiverId) {
      const message = { sender: senderId, receiver: receiverId, content: newMessage };
      try {
        await sendMessage(message);
        setMessages((prevMessages) => [...prevMessages, message]);
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <Box sx={{ padding: 3, maxWidth: "600px", margin: "auto" }}>
      {!senderId || !receiverId ? (
        <Typography variant="h6" color="error">Error: Missing sender or receiver ID</Typography>
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            Chat with {username} {onlineUsers.get(receiverId) ? "🟢 Online" : "⚪ Offline"}
          </Typography>

          <List sx={{ maxHeight: 400, overflowY: "auto", marginBottom: 2 }}>
            {messages.map((message, index) => (
              <ListItem key={index} sx={{ justifyContent: message.sender === senderId ? "flex-end" : "flex-start" }}>
                <ListItemText
                  primary={message.content}
                  sx={{
                    backgroundColor: message.sender === senderId ? "#dcf8c6" : "#ffffff",
                    borderRadius: 2,
                    padding: 1,
                    maxWidth: "80%",
                  }}
                />
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </List>

          {typingStatus.get(receiverId) === "TYPING" && <Typography variant="body2">Typing...</Typography>}

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField label="Type a message..." variant="outlined" fullWidth value={newMessage} onChange={handleTyping} />
            <IconButton onClick={handleSendMessage} sx={{ marginLeft: 1 }}>
              <SendIcon />
            </IconButton>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ChatPage;







// import React from "react";
// import { useWebSocket } from "../Config/WebsocketProvider";

// const ChatPage = () => {
//   const webSocketContext = useWebSocket();

//   if (!webSocketContext) {
//     return <div>Loading WebSocket...</div>;  // Prevents crash before context initializes
//   }

//   const { stompClient, onlineUsers, typingStatus, readReceipts } = webSocketContext;

//   if (!stompClient) {
//     return <div>Connecting to WebSocket...</div>;
//   }

//   return (
//     <div>
//       <h1>Chat Page</h1>
//       {/* Your chat UI here */}
//     </div>
//   );
// };

// export default ChatPage;

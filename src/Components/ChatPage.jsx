import React, { useState, useEffect, useRef } from "react";
import { Typography, Box, TextField, IconButton, List, ListItem, ListItemText } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { fetchMessagesBetweenUsers, fetchUserById,sendMessage } from "../Routers/api";
import { useLocation } from "react-router-dom";

// Hardcoded sender and receiver IDs
// const senderId = "9dd8145f-e40d-4e3e-87af-eeb149a169eb";  // Sender ID
// const receiverId = "f3d85e72-12fb-463f-a341-8f3c1784d63e";  // Receiver ID

// const senderId ="f3d85e72-12fb-463f-a341-8f3c1784d63e"; 
// const receiverId ="9dd8145f-e40d-4e3e-87af-eeb149a169eb";



const ChatPage = () => {
  const location = useLocation();
  const { username, senderId, receiverId } = location.state || {};
  console.log("ChatPage received:", username, senderId, receiverId);

  if (!username || !senderId || !receiverId) {
    console.error("Missing data:", { username, senderId, receiverId });
  }

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const messagesEndRef = useRef(null);  // Ref to scroll to the bottom when a new message is sent

  const fetchMessages = async () => {
    try {
      const response = await fetchMessagesBetweenUsers(senderId, receiverId);
      // Check for successful response status
      if (![200, 201].includes(response.status)) {
        throw new Error(`Failed to fetch messages. Status code: ${response.status}`);
      }
      return response.data; // Return the actual JSON response
    } catch (error) {
      console.error(error);
      return [];  // Return empty array in case of an error
    }
  };
  
  // Fetch receiver's name based on receiverId
  const fetchReceiverName = async () => {
    try {
      // Replace with actual endpoint to get the receiver's details
      const response = await fetchUserById(receiverId);
      if (!response.ok) throw new Error('Failed to fetch receiver details');
      const data = await response.json();
      return data.username;  // Return the receiver's username
    } catch (error) {
      console.error(error);
      return "Receiver";  // Default name in case of error
    }
  };

  // Fetch messages from the API when the component mounts
  useEffect(() => {
    const loadMessages = async () => {
      const fetchedMessages = await fetchMessages(); // Fetch messages
      setMessages(fetchedMessages);
    };

    loadMessages();
  }, []);  // Empty dependency array to run only once on mount

  // Fetch the receiver's name
  useEffect(() => {
    const loadReceiverName = async () => {
      const name = await fetchReceiverName();
      setReceiverName(name);  // Set receiver's name
    };

    loadReceiverName();
  }, []);  // Empty dependency array to run only once on mount

  // Scroll to the bottom when messages change or a new message is sent
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const message = {
        sender: senderId,
        receiver: receiverId,
        content: newMessage,
      };
  
      try {
        const response = await sendMessage(message);
        
        // Ensure you're appending the correct message format
        setMessages((prevMessages) => [...prevMessages, { ...message, id: response.data.id }]);
  
        setNewMessage("");  // Clear input field
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <Box sx={{ padding: 3, maxWidth: "600px", margin: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Chat with {receiverName}
      </Typography>

      {/* Message List */}
      <List sx={{ maxHeight: 400, overflowY: "auto", marginBottom: 2 }}>
        {messages.map((message, index) => (
          <ListItem
            key={index}  // Use index as key if no id exists
            sx={{
              display: "flex",
              justifyContent: message.sender === senderId ? "flex-end" : "flex-start",
            }}
          >
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
        {/* Scroll to bottom */}
        <div ref={messagesEndRef} />
      </List>

      {/* Message Input */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <TextField
          label="Type a message..."
          variant="outlined"
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <IconButton onClick={handleSendMessage} sx={{ marginLeft: 1 }}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatPage;

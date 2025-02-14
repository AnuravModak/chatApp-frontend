// WelcomePage.js
import React, { useEffect, useState } from "react";
import { fetchUsers } from "../Routers/api"; // Ensure correct path to your API file
import { List, ListItem, ListItemText, CircularProgress, Alert, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import "../Styles/WelcomePage.css"; // Import custom CSS file for additional styling

const WelcomePage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Use navigate to programmatically navigate to another page

  useEffect(() => {
    fetchUsers()
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load users.");
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress />; // MUI CircularProgress for loading state
  if (error) return <Alert severity="error">{error}</Alert>; // MUI Alert for error handling

  return (
    <Box sx={{ padding: 3, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Welcome! Select a User:
      </Typography>
      <List className="user-list">
        {users.map((user) => (
          <ListItem
            button
            key={user.id}
            className="user-item"
            onClick={() => {
              navigate("/chat", {
                state: { 
                  username: user.username,
                  senderId: "9dd8145f-e40d-4e3e-87af-eeb149a169eb",
                  receiverId: user.id,
                } 
              });
            }}
          >
            <ListItemText primary={user.username} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default WelcomePage;

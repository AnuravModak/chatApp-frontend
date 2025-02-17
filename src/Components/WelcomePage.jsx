// WelcomePage.js
import React, { useEffect, useState } from "react";
import { fetchUsers } from "../Routers/api"; 
import { List, ListItem, ListItemText, CircularProgress, Alert, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../Styles/WelcomePage.css";

const WelcomePage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Get the senderId from localStorage
  const senderId = localStorage.getItem("senderId");

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

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

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
                  senderId, // Use the senderId from localStorage
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

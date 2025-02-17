// SenderPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Box, Typography, Container, Card, CardContent } from "@mui/material";
import "../Styles/SenderPage.css"; // Import custom CSS file for styling

const SenderPage = () => {
  const [senderId, setSenderId] = useState("");
  const navigate = useNavigate();

  const handleSenderIdChange = (event) => {
    setSenderId(event.target.value);
  };

  const handleSubmit = () => {
    if (senderId) {
      // Store senderId in localStorage before navigating
      localStorage.setItem("senderId", senderId);
      navigate("/welcome");
    } else {
      alert("Please enter a valid sender ID");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 4 }}>
        <Card className="sender-card">
          <CardContent>
            <Typography variant="h5" align="center" className="title">
              Enter Sender ID
            </Typography>
            <TextField
              label="Sender ID"
              variant="outlined"
              value={senderId}
              onChange={handleSenderIdChange}
              fullWidth
              className="input-field"
              sx={{ marginBottom: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              fullWidth
              className="submit-button"
            >
              Submit
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default SenderPage;

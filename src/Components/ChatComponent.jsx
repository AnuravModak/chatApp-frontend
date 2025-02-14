import React, { useState } from "react";

const ChatComponent = () => {
    const [sender, setSender] = useState("9dd8145f-e40d-4e3e-87af-eeb149a169eb");  // Sender UUID
    const [receiver, setReceiver] = useState("f3d85e72-12fb-463f-a341-8f3c1784d63e");  // Receiver UUID
    const [message, setMessage] = useState("");  // Message content
    const [messages, setMessages] = useState([]);  // Chat messages array

    const sendMessage = async () => {
        if (!sender || !receiver || !message) {
            alert("Please enter sender UUID, receiver UUID, and message!");
            return;
        }

        const messageDTO = {
            sender: sender,
            receiver: receiver,
            content: message
        };

        await fetch("http://localhost:8080/api/chat/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(messageDTO)
        });

        setMessages([...messages, messageDTO]);
        setMessage("");
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Chat Application</h2>

            {/* Sender UUID Input */}
            <div>
                <input
                    type="text"
                    placeholder="Enter your (sender) UUID"
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                />
            </div>

            {/* Receiver UUID Input */}
            <div>
                <input
                    type="text"
                    placeholder="Enter receiver UUID"
                    value={receiver}
                    onChange={(e) => setReceiver(e.target.value)}
                />
            </div>

            {/* Message Input */}
            <div>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>

            {/* Display Messages */}
            <div>
                <h3>Messages</h3>
                <ul>
                    {messages.map((msg, index) => (
                        <li key={index}>
                            <strong>{msg.sender}: </strong>
                            {msg.content}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ChatComponent;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WebSocketProvider } from "./Config/WebsocketProvider";  // Ensure correct import path
import WelcomePage from "./Components/WelcomePage";
import ChatPage from "./Components/ChatPage";
import SenderPage from "./Components/SenderPage";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<SenderPage />} />
      <Route path="/welcome" element={<WelcomePage />} /> 
        <Route 
          path="/chat" 
          element={
            <WebSocketProvider>
              <ChatPage />
            </WebSocketProvider>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;

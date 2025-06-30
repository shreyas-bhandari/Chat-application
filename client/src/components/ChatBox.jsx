import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

function ChatBox() {
  const [username, setUsername] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/messages")
      .then(res => setMessages(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => socket.off("receive_message");
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (text.trim()) {
      socket.emit("send_message", { username, text });
      setText("");
    }
  };

  if (!isJoined) {
    return (
      <div className="join-box">
        <h2>Enter your name to join</h2>
        <input
          type="text"
          placeholder="Your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          onClick={() => {
            if (username.trim()) {
              // localStorage.setItem("username", username);
              setIsJoined(true);
            }
          }}
        >
          Join
        </button>
      </div>
    );
  }

  return (
    <div className="chat-box">
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg._id || Math.random()} className={`message ${msg.username === username ? "own" : ""}`}>
            <strong>{msg.username}:</strong> {msg.text}
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>
      <div className="input-area">
        <input
          type="text"
          placeholder="Type message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatBox;

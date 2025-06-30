import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

function ChatBox() {
  const [username, setUsername] = useState("Shreyas");
  const [room, setRoom] = useState("general");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Join room on mount and when room changes
  useEffect(() => {
    socket.emit("join_room", room);
    // Fetch old messages for the room
    axios.get(`http://localhost:5000/api/messages?room=${room}`)
      .then(res => setMessages(res.data))
      .catch(err => console.error(err));
  }, [room]);

  // Receive real-time message
  useEffect(() => {
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => socket.off("receive_message");
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Send message
  const sendMessage = () => {
    if (text.trim()) {
      socket.emit("send_message", { username, text, room });
      setText("");
    }
  };

  // Delete message
  const deleteMessage = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/messages/${id}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  return (
    <div className="chat-box">
      <div className="username-input">
        <label htmlFor="username">Username: </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
      </div>
      <div className="room-input" style={{ marginBottom: "10px" }}>
        <label htmlFor="room">Room: </label>
        <input
          id="room"
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Enter room name"
        />
      </div>
      <div className="messages" style={{ flexGrow: 1, overflowY: "auto" }}>
        {messages.map((msg) => (
          <div key={msg._id || Math.random()} className="message">
            <strong>{msg.username}:</strong> {msg.text}
            {msg._id && (
              <button
                className="delete-btn"
                onClick={() => deleteMessage(msg._id)}
                title="Delete message"
              >
                &times;
              </button>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <input
          type="text"
          placeholder="Type message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <style jsx>{`
        .username-input {
          margin-bottom: 10px;
        }
        .username-input input,
        .room-input input {
          padding: 6px;
          border-radius: 4px;
          border: none;
          width: 200px;
        }
        .message {
          padding: 8px;
          margin-bottom: 6px;
          background: #333;
          border-radius: 6px;
          position: relative;
        }
        .delete-btn {
          position: absolute;
          right: 8px;
          top: 8px;
          background: transparent;
          border: none;
          color: red;
          font-weight: bold;
          cursor: pointer;
          font-size: 16px;
          line-height: 1;
        }
      `}</style>
    </div>
  );
}

export default ChatBox;

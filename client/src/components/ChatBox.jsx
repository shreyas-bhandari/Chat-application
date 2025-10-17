import React, { useState, useEffect } from "react";
import axios from "axios";
import socket from "../socket";
import Message from "./Message";
import MessageInput from "./MessageInput";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/api/messages`)
      .then((res) => setMessages(res.data));

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("message");
  }, []);

  return (
    <div style={{ width: "400px", margin: "auto" }}>
      <h2>Real-Time Chat App 💬</h2>
      <div
        style={{
          border: "1px solid gray",
          padding: "10px",
          height: "300px",
          overflowY: "scroll",
        }}
      >
        {messages.map((msg) => (
          <Message key={msg._id} msg={msg} />
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatBox;

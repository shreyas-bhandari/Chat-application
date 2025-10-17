import React, { useState } from "react";
import socket from "../socket";

const MessageInput = () => {
  const [username, setUsername] = useState("");
  const [text, setText] = useState("");

  const sendMessage = () => {
    if (username && text) {
      socket.emit("sendMessage", { username, text });
      setText("");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="Type message"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default MessageInput;

import React from "react";

const Message = ({ msg }) => (
  <p>
    <strong>{msg.username}:</strong> {msg.text}
  </p>
);

export default Message;

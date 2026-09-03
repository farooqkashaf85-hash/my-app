import { useState, useEffect } from "react";
import socket from "../socket";

function Chat() {
  // Room ID store karne ke liye
  const [room, setRoom] = useState("");

  // Current message input
  const [message, setMessage] = useState("");

  // Saare messages store hongay
  const [messages, setMessages] = useState([]);

  // Room join status
  const [joined, setJoined] = useState(false);

  // Typing indicator
  const [typing, setTyping] = useState(false);

  // Room join function
  const joinRoom = () => {
    if (room) {
      socket.emit("join_room", room);
      setJoined(true);
    }
  };

  // Message send  function
  const sendMessage = () => {
    if (!message.trim()) return;

    const messageData = {
      room,
      sender: "User",
      text: message,
    };

    socket.emit("send_message", messageData);

    // Input clear 
    setMessage("");
  };

  useEffect(() => {
    // Message receive event
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Kisi user ke typing karne ka event
    socket.on("user_typing", () => {
      setTyping(true);

      setTimeout(() => {
        setTyping(false);
      }, 1000);
    });

    // Cleanup
    return () => {
      socket.off("receive_message");
      socket.off("user_typing");
    };
  }, []);

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
      }}
    >
      <h2>Room Chat</h2>

      {/* Room Input */}
      <input
        type="text"
        placeholder="Enter Room ID"
        onChange={(e) => setRoom(e.target.value)}
      />

      <button onClick={joinRoom}>Join Room</button>

      {/* Room Joined Message */}
      {joined && (
        <p style={{ color: "green" }}>
          ✅ Joined Room: {room}
        </p>
      )}

      <br />
      <br />

      {/* Message Input */}
      <input
        type="text"
        placeholder="Type a message"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);

          // Typing event
          socket.emit("typing", room);
        }}
      />

      <button onClick={sendMessage}>Send</button>

      {/* Typing Indicator */}
      {typing && (
        <p style={{ color: "gray" }}>
          ✍️ User is typing...
        </p>
      )}

      <hr />

      {/* Messages Area */}
      <div
        style={{
          maxHeight: "350px",
          overflowY: "auto",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: "12px",
              padding: "10px",
              background: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            {/* Sender Name */}
            <strong>{msg.sender}</strong>

            <p style={{ margin: "5px 0" }}>
              {msg.text}
            </p>

            {/* Timestamp */}
            {msg.timeStamp && (
              <small style={{ color: "gray" }}>
                {new Date(msg.timeStamp).toLocaleTimeString()}
              </small>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chat;
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chatassistance.css';

const BotIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="28px"
    height="28px"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-1.5-5h3v2h-3v-2zm-3-3h9v2h-9v-2z" />
    <circle cx="9.5" cy="11.5" r="1.5" />
    <circle cx="14.5" cy="11.5" r="1.5" />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="24px"
    height="24px"
  >
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
  </svg>
);


function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    setChatHistory([
      {
        role: 'model',
        parts: [{ text: 'Hello! How can I help you with our courses today?' }],
      },
    ]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { role: 'user', parts: [{ text: message }] };
    const newChatHistory = [...chatHistory, userMessage];
    setChatHistory(newChatHistory);
    setMessage('');
    setLoading(true);

    try {
      const historyForAPI = newChatHistory.map(msg => ({
        role: msg.role,
        parts: msg.parts,
      }));
      const systemPrompt = "You are a friendly and helpful assistant for a Learning Management System (LMS). Your role is to answer student's questions about courses, assignments, platform features, and deadlines. Be concise and clear.";
      
      const response = await axios.post('/api/v1/chat', {
        message: `${systemPrompt}\n\n${message}`,
        history: historyForAPI,
      });

      const botResponse = { role: 'model', parts: [{ text: response.data.response }] };
      setChatHistory([...newChatHistory, botResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        role: 'model',
        parts: [{ text: 'Sorry, there is not enough tokens left.' }],
      };
      setChatHistory([...newChatHistory, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-assistant-container">
      {isOpen && (
        <div className="chat-window">
            <div className="chat-header">
                <h2>LMS Assistant</h2>
            </div>
            <div className="chat-body">
                {chatHistory.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.role}`}>
                    <p>{msg.parts[0].text}</p>
                </div>
                ))}
                {loading && (
                <div className="chat-message model">
                    <p>Typing...</p>
                </div>
                )}
                <div ref={chatEndRef} />
            </div>
            <form className="chat-input" onSubmit={sendMessage}>
                <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about courses, assignments..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
      )}
      {!isOpen && (
        <div className="popup-label">
          Need Help?
        </div>
      )}
      <button onClick={toggleChat} className="chat-toggle-button">
        {isOpen ? <CloseIcon /> : <BotIcon />}
      </button>
    </div>
  );
}

export default ChatAssistant;
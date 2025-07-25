import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ChatAssistant.css';


const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
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
      { role: 'model', parts: [{ text: 'Hello! How can I help you with our products today?' }] },
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
      const systemPrompt = "You are a helpful customer service assistant for an Learning Management System app . Your role is to answer questions about Software Engineering and courses. Be friendly, concise, and professional.";
      
      const historyForAPI = newChatHistory.map(msg => ({ role: msg.role, parts: msg.parts }));

      const response = await axios.post('/api/v1/chat', {
        message: `${systemPrompt}\n\nUser question: ${message}`,
        history: historyForAPI,
      });

      const botResponse = { role: 'model', parts: [{ text: response.data.response }] };
      setChatHistory([...newChatHistory, botResponse]);

    } catch (error) {
      const errorMessage = {
        role: 'model',
        parts: [{ text: 'Sorry, I am having trouble connecting. Please try again later.' }],
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
            <h2>Customer Support</h2>
            <button onClick={toggleChat} className="close-btn">&times;</button>
          </div>
          <div className="chat-body">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.role}`}>
                <p>{msg.parts[0].text}</p>
              </div>
            ))}
            {loading && <div className="chat-message model"><p>Typing...</p></div>}
            <div ref={chatEndRef} />
          </div>
          <form className="chat-input" onSubmit={sendMessage}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about products..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
      <button onClick={toggleChat} className="chat-toggle-button">
        {!isOpen && <ChatIcon />}
      </button>
    </div>
  );
}

export default ChatAssistant;
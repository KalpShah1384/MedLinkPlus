import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { FaPaperPlane, FaRegSmile } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Messages = () => {
  const { userData, token, backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData || !token) {
      navigate('/login');
      return;
    }

    fetchConversations();
  }, [userData, token, navigate]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
    }
  };

  const selectConversation = async (userId) => {
    try {
      const response = await axios.get(`${backendUrl}/api/messages/conversation/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedConversation(userId);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await axios.post(`${backendUrl}/api/messages`, {
        receiverId: selectedConversation,
        content: newMessage,
        type: 'text'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Clear input
      setNewMessage('');

      // Refresh messages
      selectConversation(selectedConversation);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Conversations List */}
      <div className="w-64 bg-white border-r">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Messages</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-4rem)]">
          {conversations.map((conversation) => (
            <div
              key={conversation.userId}
              onClick={() => selectConversation(conversation.userId)}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${
                selectedConversation === conversation.userId ? 'bg-gray-50' : ''
              }`}
            >
              <div className="flex items-center">
                <div className="flex-1">
                  <h3 className="font-semibold">{conversation.name}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(conversation.latestMessage).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Messages Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {selectedConversation ? (
            messages.map((message, index) => (
              <div
                key={message._id}
                className={`mb-4 ${
                  message.senderId === userData._id
                    ? 'ml-auto bg-blue-100'
                    : 'mr-auto bg-gray-100'
                } rounded-lg p-3 max-w-[80%]`}
              >
                <p className="text-sm text-gray-600">
                  {message.senderId === userData._id ? 'You' : message.name}
                </p>
                <p>{message.content}</p>
                <p className="text-xs text-gray-500 text-right">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-600">Select a conversation to start messaging</p>
            </div>
          )}
        </div>

        {/* Message Input */}
        <form onSubmit={sendMessage} className="border-t p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded-lg"
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <FaPaperPlane />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Messages;

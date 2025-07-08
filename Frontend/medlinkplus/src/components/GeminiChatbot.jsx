import React, { useState, useRef, useEffect } from "react";
import "./GeminiChatbot.css";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const GeminiChatbot = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I am Gemini 2.0 Flash. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const chatEndRef = useRef(null);
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !apiKey) return;
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Medical keyword check
    const medicalKeywords = [
      'medical', 'doctor', 'health', 'medicine', 'symptom', 'treatment', 'diagnosis', 'prescription', 'illness', 'disease', 'hospital', 'clinic', 'patient', 'pharmacy', 'therapy', 'injury', 'vaccine', 'infection', 'surgery', 'checkup', 'consultation', 'appointment', 'emergency', 'pain', 'fever', 'cough', 'cold', 'diabetes', 'blood', 'pressure', 'cardiology', 'neurology', 'dermatology', 'pediatric', 'gynecology', 'orthopedic', 'ENT', 'allergy', 'asthma', 'cancer', 'covid', 'mental health', 'anxiety', 'depression', 'nutrition', 'diet', 'exercise', 'wellness'
    ];
    const isMedical = medicalKeywords.some(kw => input.toLowerCase().includes(kw));
    if (!isMedical) {
      setMessages((prev) => [...prev, { role: "assistant", content: "I am a medical chatbot and can only assist with medical-related queries." }]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: input }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 256 }
        })
      });
      const data = await res.json();
      const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't get a response.";
      setMessages((prev) => [...prev, { role: "assistant", content: botReply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, there was an error connecting to Gemini." }]);
    }
    setLoading(false);
  };

  return (
    <>
      {!open && (
        <button
          className="gemini-chatbot-toggle"
          aria-label="Open Gemini Chatbot"
          onClick={() => setOpen(true)}
          style={{ background: '#1c7856', color: '#fff' }}
        >
          <img src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" alt="Chatbot Icon" style={{ width: 32, height: 32 }} />
        </button>
      )}
      <div
        className={`gemini-chatbot-flash${open ? " open" : ""}`}
        style={{
          background: "var(--card)",
          color: "var(--card-foreground)",
          border: `1.5px solid var(--border)`
        }}
      >
        <div className="chat-header" style={{background: "#1c7856", color: "#fff"}}>
          <img src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" alt="Chatbot Icon" className="gemini-logo" />
          Gemini 2.0 Flash
          <button
            className="chat-close"
            aria-label="Close"
            onClick={() => setOpen(false)}
            style={{marginLeft: "auto", background: "none", border: "none", color: "inherit", fontSize: 22, cursor: "pointer"}}
          >×</button>
        </div>
        <div className="chat-body">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.role}`}>{msg.content}</div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form className="chat-input-row" onSubmit={sendMessage}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={apiKey ? "Type your message..." : "Add Gemini API Key in .env"}
            disabled={loading || !apiKey}
            style={{background: "var(--background-secondary)", color: "var(--foreground)"}}
          />
          <button type="submit" disabled={loading || !input.trim() || !apiKey} style={{background: "#1c7856", color: "#fff"}}>Send</button>
        </form>
      </div>
    </>
  );
};

export default GeminiChatbot;

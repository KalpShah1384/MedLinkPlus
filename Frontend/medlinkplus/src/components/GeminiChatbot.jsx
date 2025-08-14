import React, { useState, useRef, useEffect } from "react";
import "./GeminiChatbot.css";
import { useChatbot } from "./ChatbotContext";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const SYMPTOM_CHECKER_API_URL = "http://localhost:4000/api/symptom-checker";

const GeminiChatbot = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I am the MediLink Plus Chatbot. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [symptomMode, setSymptomMode] = useState(false);
  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // Use chatbot context for open/setOpen
  const { open, setOpen } = useChatbot();

  // Voice-to-text logic
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };
      recognitionRef.current.onend = () => setListening(false);
      recognitionRef.current.onerror = () => setListening(false);
    }
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      setListening(true);
      recognitionRef.current.start();
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  // Helper: detect if input is likely a symptom description
  const isSymptomInput = (text) => {
    const symptomKeywords = [
      'symptom', 'pain', 'ache', 'fever', 'cough', 'cold', 'nausea', 'vomit', 'headache', 'dizzy', 'fatigue', 'weakness', 'swelling', 'rash', 'itch', 'cramp', 'constipation', 'diarrhea', 'injury', 'infection', 'bleeding', 'burn', 'cut', 'wound', 'fracture', 'sprain', 'sore', 'throat', 'stomach', 'chest', 'back', 'leg', 'arm', 'eye', 'ear', 'tooth', 'teeth', 'gum', 'foot', 'hand', 'joint', 'muscle', 'bone', 'vomiting', 'appetite', 'weight', 'sleep', 'insomnia', 'anxiety', 'depression', 'allergy', 'asthma', 'diabetes', 'pressure', 'heart', 'lung', 'kidney', 'liver', 'thyroid', 'period', 'pregnancy', 'child', 'baby', 'elderly', 'senior', 'adult', 'teen', 'puberty', 'growth', 'wellness', 'consult', 'doctor', 'medicine', 'treatment', 'remedy', 'issue', 'problem', 'emergency', 'urgent', 'consultation', 'checkup', 'diagnosis', 'prescription', 'therapy', 'mental', 'stress', 'burning', 'itching', 'migraine', 'dizzy', 'vomit', 'nausea', 'chills', 'sweat', 'shiver', 'runny nose', 'blocked nose', 'sneeze', 'flu', 'infection', 'injury', 'fracture', 'bruise', 'sprain', 'cut', 'wound', 'bleed', 'burn', 'swelling', 'redness', 'pus', 'discharge', 'painful', 'hurts', 'hurting', 'sick', 'unwell', 'ill', 'problem', 'issue', 'concern', 'difficulty', 'discomfort', 'distress', 'trouble', 'complication', 'abnormal', 'change', 'symptoms', 'signs', 'feeling', 'experience', 'sensation'
    ];
    const lower = text.toLowerCase();
    return symptomKeywords.some((kw) => lower.includes(kw));
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    // If symptomMode is enabled or input looks like symptoms, use AI symptom checker
    if (symptomMode || isSymptomInput(input)) {
      setLoading(true);
      try {
        const res = await fetch(SYMPTOM_CHECKER_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symptoms: input })
        });
        const data = await res.json();
        if (data.success) {
          setMessages((prev) => [...prev, userMessage, { role: 'assistant', content: data.result }]);
        } else {
          setMessages((prev) => [...prev, userMessage, { role: 'assistant', content: 'Sorry, I could not process your symptoms right now.' }]);
        }
      } catch (err) {
        setMessages((prev) => [...prev, userMessage, { role: 'assistant', content: 'Sorry, there was an error connecting to the AI Symptom Checker.' }]);
      }
      setLoading(false);
      setSymptomMode(false);
      return;
    }
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Medical keyword check
    // Flexible medical/health detection
    const medicalKeywords = [
      'medical', 'doctor', 'health', 'medicine', 'symptom', 'treatment', 'diagnosis', 'prescription', 'illness', 'disease', 'hospital', 'clinic', 'patient', 'pharmacy', 'therapy', 'injury', 'vaccine', 'infection', 'surgery', 'checkup', 'consultation', 'appointment', 'emergency', 'pain', 'fever', 'cough', 'cold', 'diabetes', 'blood', 'pressure', 'cardiology', 'neurology', 'dermatology', 'pediatric', 'gynecology', 'orthopedic', 'ENT', 'allergy', 'asthma', 'cancer', 'covid', 'mental health', 'anxiety', 'depression', 'nutrition', 'diet', 'exercise', 'wellness', 'hurt', 'problem', 'issue', 'remedy', 'remedies', 'ache', 'sore', 'swelling', 'fracture', 'sprain', 'bruise', 'burn', 'cut', 'wound', 'rash', 'itch', 'infection', 'migraine', 'headache', 'stomach', 'leg', 'arm', 'back', 'chest', 'eye', 'ear', 'throat', 'skin', 'bone', 'muscle', 'joint', 'tooth', 'teeth', 'gum', 'foot', 'feet', 'hand', 'finger', 'toe', 'nail', 'hair', 'vision', 'hearing', 'vomit', 'nausea', 'dizzy', 'fatigue', 'weakness', 'appetite', 'weight', 'sleep', 'insomnia', 'snoring', 'allergic', 'reaction', 'emergency', 'ambulance', 'burning', 'bleeding', 'cramp', 'constipation', 'diarrhea', 'urine', 'pee', 'poop', 'bowel', 'digest', 'digestive', 'liver', 'kidney', 'lung', 'heart', 'brain', 'spine', 'nerve', 'anemia', 'cholesterol', 'thyroid', 'menstrual', 'period', 'pregnancy', 'pregnant', 'baby', 'child', 'infant', 'elderly', 'senior', 'adult', 'teen', 'adolescent', 'puberty', 'growth', 'development', 'well-being', 'wellbeing', 'wellness', 'clinic', 'hospital', 'ambulance', 'first aid', 'emergency', 'urgent', 'consult', 'consultation', 'specialist', 'surgeon', 'physician', 'dentist', 'optometrist', 'ophthalmologist', 'gynecologist', 'pediatrician', 'psychiatrist', 'psychologist', 'therapist', 'counselor', 'nutritionist', 'dietitian', 'physical therapist', 'occupational therapist', 'speech therapist', 'pharmacist', 'nurse', 'midwife', 'paramedic', 'caregiver', 'care', 'treat', 'treatment', 'manage', 'management', 'prevention', 'prevent', 'cure', 'heal', 'healing', 'recovery', 'rehabilitation', 'rehab', 'support', 'support group', 'self-care', 'self care', 'selfcare'
    ];
    // Flexible phrase and keyword match
    const lowerInput = input.toLowerCase();
    const phrasePatterns = [
      /\b(issue|problem|pain|hurt|ache|injury|swelling|fracture|sprain|bruise|burn|cut|wound|rash|itch|infection|migraine|headache|stomach|leg|arm|back|chest|eye|ear|throat|skin|bone|muscle|joint|tooth|teeth|gum|foot|feet|hand|finger|toe|nail|hair|vomit|nausea|dizzy|fatigue|weakness|cramp|constipation|diarrhea|urine|pee|poop|bowel|digest|digestive|liver|kidney|lung|heart|brain|spine|nerve|anemia|cholesterol|thyroid|menstrual|period|pregnancy|pregnant|baby|child|infant|elderly|senior|adult|teen|adolescent|puberty|growth|development|well-being|wellness)\b/, // body parts and common health issues
      /(problem|issue|pain|ache|hurt|remedy|remedies|treatment|symptom|consult|see|doctor|medicine|medication|health|hospital|clinic|appointment|diagnosis|prescription|therapy|allergy|asthma|cancer|covid|mental health|anxiety|depression|nutrition|diet|exercise|wellness|checkup|consultation|emergency|fever|cough|cold|diabetes|blood|pressure|cardiology|neurology|dermatology|pediatric|gynecology|orthopedic|ENT)/
    ];
    const isMedical = medicalKeywords.some(kw => lowerInput.includes(kw)) || phrasePatterns.some(rx => rx.test(lowerInput));
    if (!isMedical) {
      setMessages((prev) => [...prev, { role: "assistant", content: "I am a medical chatbot and can only assist with medical-related queries." }]);
      return;
    }

    setLoading(true);
    try {
      // Add system prompt for language
      let languagePrompt = '';
      switch(selectedLanguage) {
        case 'hi': languagePrompt = 'Please reply in Hindi.'; break;
        case 'gu': languagePrompt = 'Please reply in Gujarati.'; break;
        case 'mr': languagePrompt = 'Please reply in Marathi.'; break;
        case 'ta': languagePrompt = 'Please reply in Tamil.'; break;
        case 'te': languagePrompt = 'Please reply in Telugu.'; break;
        case 'bn': languagePrompt = 'Please reply in Bengali.'; break;
        case 'pa': languagePrompt = 'Please reply in Punjabi.'; break;
        case 'ur': languagePrompt = 'Please reply in Urdu.'; break;
        case 'kn': languagePrompt = 'Please reply in Kannada.'; break;
        case 'ml': languagePrompt = 'Please reply in Malayalam.'; break;
        case 'or': languagePrompt = 'Please reply in Odia.'; break;
        case 'other': languagePrompt = 'Please reply in the user requested language.'; break;
        default: languagePrompt = '';
      }
      const promptParts = languagePrompt ? [ { text: languagePrompt }, { text: input } ] : [ { text: input } ];
      const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: promptParts }],
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
          aria-label="Open MediLink Plus Chatbot"
          onClick={() => setOpen(true)}
          style={{ background: '#1c7856', color: '#fff' }}
        >
          <img src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" alt="MediLink Plus Chatbot Icon" style={{ width: 32, height: 32 }} />
        </button>
      )}
      <div
        className={`gemini-chatbot-flash${open ? " open" : ""}`}
        style={{
          background: "var(--card)",
          color: "var(--card-foreground)",
          border: `1.5px solid var(--border)`,
          width: 600,
          minHeight: 700,
          maxHeight: 900,
          boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
          borderRadius: 16,
          zIndex: 1000
        }}
      >
        <div style={{padding: '12px 18px 0 18px', background: 'var(--card)'}}>
          <label htmlFor="chatbot-language" style={{fontSize: 14, color: '#1c7856', fontWeight: 600, marginRight: 8}}>Language:</label>
          <select
            id="chatbot-language"
            value={selectedLanguage}
            onChange={e => setSelectedLanguage(e.target.value)}
            style={{padding: '4px 10px', borderRadius: 6, border: '1px solid #e0e0e0', fontSize: 14, color: '#1c7856', fontWeight: 600}}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="gu">Gujarati</option>
            <option value="mr">Marathi</option>
            <option value="ta">Tamil</option>
            <option value="te">Telugu</option>
            <option value="bn">Bengali</option>
            <option value="pa">Punjabi</option>
            <option value="ur">Urdu</option>
            <option value="kn">Kannada</option>
            <option value="ml">Malayalam</option>
            <option value="or">Odia</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="chat-header" style={{background: "#1c7856", color: "#fff", display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap'}}>
          <img src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" alt="MediLink Plus Chatbot Icon" className="gemini-logo" />
          <span style={{fontWeight: 600, fontSize: 18}}>MediLink Plus Chatbot</span>
          <button
            style={{ marginLeft: 8, background: symptomMode ? '#4caf50' : '#1976d2', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: 14 }}
            onClick={() => setSymptomMode((v) => !v)}
            type="button"
            aria-pressed={symptomMode}
          >
            {symptomMode ? 'Symptom Checker: ON' : 'Use Symptom Checker'}
          </button>
          <button
            className="chat-close"
            aria-label="Close"
            onClick={() => setOpen(false)}
            style={{marginLeft: "auto", background: "none", border: "none", color: "inherit", fontSize: 22, cursor: "pointer"}}
          >×</button>
        </div>
        <div className="chat-body" style={{ maxHeight: 500, minHeight: 350, overflowY: 'auto', padding: '16px 24px', background: '#f8f9fa' }}>
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
          <button
            type="button"
            className={`mic-btn${listening ? ' listening' : ''}`}
            aria-label={listening ? 'Stop listening' : 'Start voice input'}
            onClick={toggleListening}
            style={{
              background: listening ? '#1c7856' : '#ededed',
              color: listening ? '#fff' : '#333',
              border: 'none',
              borderRadius: 8,
              marginRight: 8,
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            disabled={loading || !apiKey}
          >
            <span role="img" aria-label="mic">🎤</span>
          </button>
          <button type="submit" disabled={loading || !input.trim() || !apiKey} style={{background: "#1c7856", color: "#fff"}}>Send</button>
        </form>
      </div>
    </>
  );
};

export default GeminiChatbot;

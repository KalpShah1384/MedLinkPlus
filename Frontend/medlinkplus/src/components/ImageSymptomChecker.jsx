import React, { useState } from "react";

const ImageSymptomChecker = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setResult("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    setLoading(true);
    setResult("");
    setError("");
    const formData = new FormData();
    formData.append("image", selectedFile);
    try {
      const res = await fetch("http://localhost:4000/api/symptom-checker/image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.result);
      } else {
        setError(data.message || "Could not analyze the image.");
      }
    } catch (err) {
      setError("Error connecting to the image symptom checker.");
    }
    setLoading(false);
  };

  const [open, setOpen] = useState(false);

  return (
    <div style={{ textAlign: 'center', margin: '18px auto', maxWidth: 420 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          background: open ? '#4caf50' : '#1976d2',
          border: '4px solid red', // Debug border
          borderRadius: '50%',
          width: 70,
          height: 70,
          cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(0,0,0,0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 12,
          zIndex: 9999 // ensure on top
        }}
        title="Image Symptom Checker"
      >
        <img 
          src="/healthcare.png" 
          alt="Symptom Checker" 
          style={{ width: 40, height: 40 }} 
          onError={e => { e.target.style.display='none'; e.target.parentNode.innerHTML+='<span style=\'color:white;font-weight:bold;\'>Logo Not Found</span>'; }}
        />
      </button>
      {open && (
        <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 12, margin: '0 auto', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' }}>
          <h3 style={{ color: '#1c7856', marginBottom: 12 }}>Image Symptom Checker</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button type="submit" style={{ background: '#1976d2', color: '#fff', border: 'none', padding: '8px 0', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }} disabled={loading || !selectedFile}>
              {loading ? "Analyzing..." : "Check Symptoms from Image"}
            </button>
          </form>
          {result && <div style={{ marginTop: 14, color: '#333', background: '#e6ffe6', padding: 10, borderRadius: 6 }}>{result}</div>}
          {error && <div style={{ marginTop: 14, color: 'red' }}>{error}</div>}
          <div style={{ marginTop: 10, fontSize: 12, color: '#888' }}>
            <b>Disclaimer:</b> This is not a diagnosis. For emergencies, contact a doctor immediately.
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageSymptomChecker;

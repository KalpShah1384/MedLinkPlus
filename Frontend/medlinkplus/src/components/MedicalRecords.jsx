import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const MedicalRecords = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [records, setRecords] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(backendUrl + "/api/user/medical-records", { headers: { token } });
        if (data.success) setRecords(data.records);
      } catch (e) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchRecords();
  }, [token, backendUrl]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("record", file);
      const { data } = await axios.post(backendUrl + "/api/user/upload-medical-record", formData, {
        headers: { token, "Content-Type": "multipart/form-data" },
      });
      if (data.success) {
        setRecords((prev) => [data.record, ...prev]);
        setFile(null);
      }
    } catch (e) {
      // Optionally handle error
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="my-8">
      <h3 className="text-2xl font-semibold mb-4 text-[#1c7856]">Medical Records & Documents</h3>
      <form className="flex items-center gap-4 mb-6" onSubmit={handleUpload}>
        <input type="file" accept="application/pdf,image/*" onChange={handleFileChange} />
        <button
          type="submit"
          className="bg-[#1c7856] text-white px-4 py-2 rounded hover:bg-[#14543d]"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {loading ? (
        <div>Loading records...</div>
      ) : records.length ? (
        <div className="space-y-4">
          {records.map((rec) => (
  <div key={rec._id} className="p-4 border rounded-lg shadow bg-white flex flex-col md:flex-row gap-4 items-center">
    <div className="flex-1">
      <div className="font-bold text-lg">{rec.name || rec.filename}</div>
      <div className="text-xs text-gray-600">Uploaded: {new Date(rec.createdAt).toLocaleString()}</div>
      {rec.url && rec.url.toLowerCase().endsWith('.pdf') ? (
        <iframe
          src={rec.url}
          title={rec.filename}
          width="100%"
          height="400px"
          style={{ border: '1px solid #ccc', marginTop: '12px' }}
        />
      ) : null}
      <a
        href={rec.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline mt-2 inline-block"
      >
        View / Download
      </a>
    </div>
  </div>
))}
        </div>
      ) : (
        <div className="text-gray-500">No medical records uploaded yet.</div>
      )}
    </div>
  );
};

export default MedicalRecords;

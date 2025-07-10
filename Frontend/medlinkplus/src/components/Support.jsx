import React, { useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const Support = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [form, setForm] = useState({ subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const { data } = await axios.post(
        backendUrl + "/api/support",
        form,
        { headers: { token } }
      );
      if (data.success) {
        setSuccess("Your support request has been sent. We'll get back to you soon.");
        setForm({ subject: "", message: "" });
      } else {
        setError(data.message || "Failed to send support request.");
      }
    } catch (err) {
      setError("Failed to send support request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-[#1c7856]">Support / Contact Us</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Subject</label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            rows={5}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-[#1c7856] text-white px-4 py-2 rounded hover:bg-[#14543d]"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
        {success && <div className="text-green-700 mt-2">{success}</div>}
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>
    </div>
  );
};

export default Support;

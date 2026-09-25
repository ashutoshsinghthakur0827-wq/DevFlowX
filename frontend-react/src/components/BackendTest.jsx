
import { useState } from "react";

function BackendTest() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function checkBackend() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/health"
      );

      if (!response.ok) {
        throw new Error("Backend request failed");
      }

      const data = await response.json();

      setMessage(data.message);
    } catch (error) {
      setMessage(
        "Backend connection failed. Check if the server is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard-card">
      <h2>Backend Connection</h2>

      <p>
        Test the connection between React and Express.
      </p>

      <button
        className="primary-button"
        onClick={checkBackend}
        disabled={loading}
      >
        {loading ? "Checking..." : "Check Backend"}
      </button>

      {message && (
        <p style={{ marginTop: "12px" }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default BackendTest;
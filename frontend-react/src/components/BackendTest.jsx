import { useState } from "react";
import API_URL from "../config/api";

function BackendTest() {
  const [status, setStatus] = useState("Not checked yet");
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);

  const checkBackend = async () => {
    setLoading(true);
    setStatus("Checking backend...");
    setResponseData(null);

    try {
      console.log("Checking backend:", `${API_URL}/health`);

      const response = await fetch(`${API_URL}/health`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();

      console.log("Backend response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || data.detail || "Backend request failed"
        );
      }

      setStatus("Backend connected successfully");
      setResponseData(data);
    } catch (error) {
      console.error("Backend connection error:", error);

      setStatus("Backend connection failed");
      setResponseData({
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "30px auto",
        padding: "24px",
        borderRadius: "12px",
        backgroundColor: "#111827",
        color: "#ffffff",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
      }}
    >
      <h2
        style={{
          marginBottom: "16px",
          color: "#60a5fa",
        }}
      >
        DevFlow X Backend Test
      </h2>

      <p>
        <strong>Backend URL:</strong>
      </p>

      <p
        style={{
          wordBreak: "break-word",
          color: "#d1d5db",
        }}
      >
        {`${API_URL}/health`}
      </p>

      <button
        onClick={checkBackend}
        disabled={loading}
        style={{
          padding: "12px 20px",
          border: "none",
          borderRadius: "8px",
          backgroundColor: loading ? "#6b7280" : "#2563eb",
          color: "#ffffff",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        {loading ? "Checking..." : "Check Backend"}
      </button>

      <div
        style={{
          marginTop: "20px",
          padding: "16px",
          borderRadius: "8px",
          backgroundColor: "#1f2937",
        }}
      >
        <h3>Status</h3>

        <p
          style={{
            color: status.includes("successfully")
              ? "#4ade80"
              : status.includes("failed")
              ? "#f87171"
              : "#facc15",
          }}
        >
          {status}
        </p>
      </div>

      {responseData && (
        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            borderRadius: "8px",
            backgroundColor: "#030712",
            overflowX: "auto",
          }}
        >
          <h3>Backend Response</h3>

          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              color: "#d1d5db",
            }}
          >
            {JSON.stringify(responseData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default BackendTest;


import { useRef, useState } from "react";

// Express backend API URL
const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://devflowx-zmlo.onrender.com/api";

// Remove trailing slash from API URL
const BASE_URL = API_URL.replace(/\/$/, "");

// Initial welcome message
const initialMessage = {
  role: "assistant",
  content:
    "Hello! I am your DevFlow X AI Assistant. " +
    "Ask me about React, FastAPI, MERN, programming, " +
    "or your software projects.",
};

function AIAssistant() {
  const [messages, setMessages] = useState([
    initialMessage,
  ]);

  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [healthStatus, setHealthStatus] =
    useState("Not checked");

  const [error, setError] = useState("");

  const textareaRef = useRef(null);

  // Add a message to the chat
  function addMessage(role, content) {
    setMessages((previousMessages) => [
      ...previousMessages,
      {
        role,
        content,
      },
    ]);
  }

  // Check Express backend health
  async function checkAIHealth() {
    setHealthStatus("Checking...");
    setError("");

    try {
      const healthURL = `${BASE_URL}/health`;

      console.log("Checking AI health:", healthURL);

      const response = await fetch(healthURL);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.detail ||
            `Health check failed: ${response.status}`
        );
      }

      if (
        data.status === "healthy" ||
        data.status === "online"
      ) {
        setHealthStatus("AI service is healthy");
      } else {
        setHealthStatus(
          data.message ||
            data.status ||
            "AI service is connected"
        );
      }
    } catch (healthError) {
      console.error(
        "AI health error:",
        healthError
      );

      setHealthStatus("Backend is offline");

      setError(
        "Unable to connect to the AI backend. " +
          "Check your Express and FastAPI services."
      );
    }
  }

  // Send question to Express AI backend
  async function askAI() {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      setError("Please enter a question first.");
      return;
    }

    if (loading) {
      return;
    }

    setError("");

    // Display user message
    addMessage("user", trimmedQuestion);

    setQuestion("");
    setLoading(true);

    try {
      // Correct production AI endpoint:
      // /api/ai/ask
      const aiURL = `${BASE_URL}/ai/ask`;

      console.log("Sending AI request:", aiURL);

      const response = await fetch(aiURL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          message: trimmedQuestion,
          history: chatHistory,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.detail ||
            data.error ||
            `AI request failed: ${response.status}`
        );
      }

      const aiReply =
        data.reply ||
        data.response ||
        data.answer ||
        data.message ||
        "The AI returned an empty response.";

      // Display AI response
      addMessage("assistant", aiReply);

      // Update chat history
      const updatedHistory = [
        ...chatHistory,

        {
          role: "user",
          content: trimmedQuestion,
        },

        {
          role: "assistant",
          content: aiReply,
        },
      ];

      // Keep the last 20 messages
      setChatHistory(updatedHistory.slice(-20));
    } catch (chatError) {
      console.error(
        "AI chat error:",
        chatError
      );

      const errorMessage =
        chatError.message ||
        "Unable to connect to the AI service.";

      setError(errorMessage);

      addMessage(
        "assistant",
        "Sorry, I could not process your request."
      );
    } finally {
      setLoading(false);
    }
  }

  // Enter sends message
  // Shift + Enter creates a new line
  function handleKeyDown(event) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      askAI();
    }
  }

  // Use a suggested question
  function useSuggestion(suggestion) {
    setQuestion(suggestion);
    setError("");

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  }

  // Clear conversation
  function clearChat() {
    setMessages([initialMessage]);
    setChatHistory([]);
    setQuestion("");
    setError("");
    setHealthStatus("Not checked");
  }

  return (
    <div className="ai-assistant-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">
            Workspace /
          </p>

          <h1>AI Assistant</h1>

          <p>
            Ask questions using the DevFlow X AI service.
          </p>
        </div>
      </div>

      {/* AI Health Check */}
      <div className="ai-health-row">
        <button
          type="button"
          className="primary-button"
          onClick={checkAIHealth}
          disabled={loading}
        >
          Check AI Health
        </button>

        <span className="status-text">
          {healthStatus}
        </span>
      </div>

      <div className="ai-layout">
        {/* Chat Section */}
        <div className="ai-chat-card">
          <div className="ai-card-header">
            <div className="ai-avatar">
              ✦
            </div>

            <div>
              <h2>DevFlow X Assistant</h2>

              <p>
                Your AI assistant for development
                and projects.
              </p>
            </div>
          </div>

          {/* Chat Messages */}
          <div
            className="chat-messages"
            aria-live="polite"
          >
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={
                  message.role === "user"
                    ? "chat-message user-message"
                    : "chat-message assistant-message"
                }
              >
                <div className="message-label">
                  {message.role === "user"
                    ? "You"
                    : "DevFlow X AI"}
                </div>

                <div className="message-content">
                  {message.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-message assistant-message">
                <div className="message-label">
                  DevFlow X AI
                </div>

                <div className="message-content">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="chat-input-area">
            <label htmlFor="ai-question">
              Your Question
            </label>

            <textarea
              ref={textareaRef}
              id="ai-question"
              value={question}
              onChange={(event) =>
                setQuestion(event.target.value)
              }
              onKeyDown={handleKeyDown}
              rows={4}
              maxLength={4000}
              placeholder="Ask about React, FastAPI, or MERN..."
              disabled={loading}
            />

            <div className="chat-input-footer">
              <small>
                Press Enter to send.
                <br />
                Use Shift + Enter for a new line.
              </small>

              <div className="chat-button-group">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={clearChat}
                  disabled={loading}
                >
                  Clear
                </button>

                <button
                  type="button"
                  className="primary-button"
                  onClick={askAI}
                  disabled={
                    loading ||
                    !question.trim()
                  }
                >
                  {loading
                    ? "Thinking..."
                    : "Ask AI"}
                </button>
              </div>
            </div>

            {error && (
              <p className="ai-error-message">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Suggestions Section */}
        <aside className="ai-suggestions-card">
          <h3>Try asking</h3>

          <button
            type="button"
            className="suggestion-button"
            onClick={() =>
              useSuggestion(
                "Explain React in simple language."
              )
            }
          >
            Explain React
          </button>

          <button
            type="button"
            className="suggestion-button"
            onClick={() =>
              useSuggestion(
                "How do I connect React with FastAPI?"
              )
            }
          >
            React + FastAPI
          </button>

          <button
            type="button"
            className="suggestion-button"
            onClick={() =>
              useSuggestion(
                "Explain MongoDB and Express for a beginner."
              )
            }
          >
            MongoDB + Express
          </button>

          <button
            type="button"
            className="suggestion-button"
            onClick={() =>
              useSuggestion(
                "Give me a simple placement preparation roadmap."
              )
            }
          >
            Placement roadmap
          </button>

          <button
            type="button"
            className="suggestion-button"
            onClick={() =>
              useSuggestion(
                "Help me plan tasks for my DevFlow X project."
              )
            }
          >
            Plan project tasks
          </button>
        </aside>
      </div>
    </div>
  );
}

export default AIAssistant;


import { useRef, useState } from "react";

// ==================================================
// API CONFIGURATION
// ==================================================

// Your Express backend API URL
// .env:
// VITE_API_URL=https://devflowx-zmlo.onrender.com/api

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://devflowx-zmlo.onrender.com/api";

// Remove trailing slash
const BASE_URL = API_URL.replace(/\/$/, "");

// ==================================================
// INITIAL MESSAGE
// ==================================================

const initialMessage = {
  role: "assistant",
  content:
    "Hello! I am your DevFlow X AI Assistant. " +
    "Ask me about React, FastAPI, MERN, programming, " +
    "or your software projects.",
};

// ==================================================
// AI ASSISTANT COMPONENT
// ==================================================

function AIAssistant() {
  // Chat messages displayed in the interface
  const [messages, setMessages] = useState([
    initialMessage,
  ]);

  // Current question
  const [question, setQuestion] = useState("");

  // Conversation history sent to backend
  const [chatHistory, setChatHistory] = useState([]);

  // Loading state
  const [loading, setLoading] = useState(false);

  // AI health status
  const [healthStatus, setHealthStatus] =
    useState("Not checked");

  // Error message
  const [error, setError] = useState("");

  // Textarea reference
  const textareaRef = useRef(null);

  // ==================================================
  // ADD MESSAGE
  // ==================================================

  function addMessage(role, content) {
    setMessages((previousMessages) => [
      ...previousMessages,
      {
        role,
        content,
      },
    ]);
  }

  // ==================================================
  // CHECK AI HEALTH
  // ==================================================

  async function checkAIHealth() {
    setHealthStatus("Checking...");
    setError("");

    try {
      // Express AI health route
      // /api/ai/health
      const healthURL = `${BASE_URL}/ai/health`;

      console.log(
        "Checking AI health:",
        healthURL
      );

      const response = await fetch(healthURL);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.detail ||
            data.error ||
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

  // ==================================================
  // ASK AI
  // ==================================================

  async function askAI() {
    const trimmedQuestion = question.trim();

    // Validate question
    if (!trimmedQuestion) {
      setError("Please enter a question first.");
      return;
    }

    // Prevent multiple requests
    if (loading) {
      return;
    }

    setError("");

    // Display user question
    addMessage("user", trimmedQuestion);

    // Clear input
    setQuestion("");

    // Start loading
    setLoading(true);

    try {
      // Express AI request route
      // /api/ai/ask
      const aiURL = `${BASE_URL}/ai/ask`;

      console.log(
        "Sending AI request:",
        aiURL
      );

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

      // Read AI response
      const aiReply =
        data.reply ||
        data.response ||
        data.answer ||
        data.message ||
        "The AI returned an empty response.";

      // Display AI response
      addMessage("assistant", aiReply);

      // Update conversation history
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
      setChatHistory(
        updatedHistory.slice(-20)
      );
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
      // Stop loading
      setLoading(false);
    }
  }

  // ==================================================
  // KEYBOARD HANDLER
  // ==================================================

  function handleKeyDown(event) {
    // Enter sends the question
    // Shift + Enter creates a new line
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      askAI();
    }
  }

  // ==================================================
  // USE SUGGESTION
  // ==================================================

  function useSuggestion(suggestion) {
    setQuestion(suggestion);
    setError("");

    // Focus textarea
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  }

  // ==================================================
  // CLEAR CHAT
  // ==================================================

  function clearChat() {
    setMessages([initialMessage]);
    setChatHistory([]);
    setQuestion("");
    setError("");
    setHealthStatus("Not checked");
  }

  // ==================================================
  // JSX UI
  // ==================================================

  return (
    <div className="ai-assistant-page">
      {/* Page heading */}
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

      {/* Main AI Layout */}
      <div className="ai-layout">
        {/* Chat Section */}
        <div className="ai-chat-card">
          {/* Chat Header */}
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

            {/* Loading Message */}
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

          {/* Chat Input Area */}
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

            {/* Input Footer */}
            <div className="chat-input-footer">
              <small>
                Press Enter to send.
                <br />
                Use Shift + Enter for a new line.
              </small>

              <div className="chat-button-group">
                {/* Clear Button */}
                <button
                  type="button"
                  className="secondary-button"
                  onClick={clearChat}
                  disabled={loading}
                >
                  Clear
                </button>

                {/* Ask AI Button */}
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

            {/* Error Message */}
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

          {/* React Suggestion */}
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

          {/* React + FastAPI Suggestion */}
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

          {/* MongoDB + Express Suggestion */}
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

          {/* Placement Suggestion */}
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

          {/* Project Suggestion */}
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

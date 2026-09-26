import { useRef, useState } from "react";

// ==================================================
// API CONFIGURATION
// ==================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://devflowx-zmlo.onrender.com/api";

const BASE_URL = API_URL.replace(/\/$/, "");

// ==================================================
// INITIAL MESSAGE
// ==================================================

const initialMessage = {
  role: "assistant",
  content:
    "Hello! I am your DevFlow X AI Assistant. Ask me about React, FastAPI, MERN, programming, or your software projects.",
};

// ==================================================
// AI ASSISTANT
// ==================================================

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
      const healthURL =
        `${BASE_URL}/ai/health`;

      console.log(
        "Checking AI health:",
        healthURL
      );

      const response = await fetch(
        healthURL,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      console.log(
        "AI health response:",
        data
      );

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
        setHealthStatus(
          "AI service is healthy"
        );
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

      setHealthStatus(
        "Backend is offline"
      );

      setError(
        "Unable to connect to the AI backend."
      );
    }
  }

  // ==================================================
  // ASK AI
  // ==================================================

  async function askAI() {
    const trimmedQuestion =
      question.trim();

    if (!trimmedQuestion) {
      setError(
        "Please enter a question first."
      );
      return;
    }

    if (loading) {
      return;
    }

    setError("");

    // Show user's message
    addMessage(
      "user",
      trimmedQuestion
    );

    // Clear input
    setQuestion("");

    // Start loading
    setLoading(true);

    try {
      const aiURL =
        `${BASE_URL}/ai/ask`;

      console.log(
        "AI URL:",
        aiURL
      );

      console.log(
        "AI Request:",
        {
          message: trimmedQuestion,
          history: chatHistory,
        }
      );

      const response = await fetch(
        aiURL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",
          },

          body: JSON.stringify({
            message:
              trimmedQuestion,

            history:
              chatHistory,
          }),
        }
      );

      const responseText =
        await response.text();

      console.log(
        "AI Status:",
        response.status
      );

      console.log(
        "AI Raw Response:",
        responseText
      );

      let data;

      try {
        data =
          JSON.parse(responseText);
      } catch {
        throw new Error(
          `Invalid server response. Status: ${response.status}`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
          data.detail ||
          data.error ||
          `AI request failed: ${response.status}`
        );
      }

      // ==================================================
      // GET AI REPLY
      // ==================================================

      const aiReply =
        data.reply ||
        data.response ||
        data.answer ||
        data.message ||
        "The AI returned an empty response.";

      // Show AI response
      addMessage(
        "assistant",
        aiReply
      );

      // ==================================================
      // UPDATE CHAT HISTORY
      // ==================================================

      const updatedHistory = [
        ...chatHistory,

        {
          role: "user",
          content:
            trimmedQuestion,
        },

        {
          role: "assistant",
          content:
            aiReply,
        },
      ];

      // Keep latest 20 messages
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

      setError(
        errorMessage
      );

      addMessage(
        "assistant",
        "Sorry, I could not process your request."
      );

    } finally {
      setLoading(false);
    }
  }

  // ==================================================
  // KEYBOARD HANDLER
  // ==================================================

  function handleKeyDown(event) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      askAI();
    }
  }

  // ==================================================
  // SUGGESTION
  // ==================================================

  function useSuggestion(
    suggestion
  ) {
    setQuestion(
      suggestion
    );

    setError("");

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  }

  // ==================================================
  // CLEAR CHAT
  // ==================================================

  function clearChat() {
    setMessages([
      initialMessage,
    ]);

    setChatHistory([]);

    setQuestion("");

    setError("");

    setHealthStatus(
      "Not checked"
    );
  }

  // ==================================================
  // JSX
  // ==================================================

  return (
    <div className="ai-assistant-page">

      {/* PAGE HEADING */}

      <div className="page-heading">

        <div>

          <p className="eyebrow">
            Workspace /
          </p>

          <h1>
            AI Assistant
          </h1>

          <p>
            Ask questions using the
            DevFlow X AI service.
          </p>

        </div>

      </div>

      {/* AI HEALTH */}

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

      {/* MAIN LAYOUT */}

      <div className="ai-layout">

        {/* CHAT */}

        <div className="ai-chat-card">

          {/* HEADER */}

          <div className="ai-card-header">

            <div className="ai-avatar">
              ✦
            </div>

            <div>

              <h2>
                DevFlow X Assistant
              </h2>

              <p>
                Your AI assistant for
                development and projects.
              </p>

            </div>

          </div>

          {/* MESSAGES */}

          <div
            className="chat-messages"
            aria-live="polite"
          >

            {messages.map(
              (message, index) => (

                <div
                  key={`${message.role}-${index}`}
                  className={
                    message.role ===
                    "user"
                      ? "chat-message user-message"
                      : "chat-message assistant-message"
                  }
                >

                  <div className="message-label">

                    {message.role ===
                    "user"
                      ? "You"
                      : "DevFlow X AI"}

                  </div>

                  <div className="message-content">

                    {message.content}

                  </div>

                </div>

              )
            )}

            {/* LOADING */}

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

          {/* INPUT */}

          <div className="chat-input-area">

            <label htmlFor="ai-question">
              Your Question
            </label>

            <textarea
              ref={textareaRef}
              id="ai-question"
              value={question}
              onChange={(event) =>
                setQuestion(
                  event.target.value
                )
              }
              onKeyDown={
                handleKeyDown
              }
              rows={4}
              maxLength={4000}
              placeholder="Ask about React, FastAPI, MERN..."
              disabled={loading}
            />

            {/* FOOTER */}

            <div className="chat-input-footer">

              <small>
                Press Enter to send.
                <br />
                Use Shift + Enter
                for a new line.
              </small>

              <div className="chat-button-group">

                {/* CLEAR */}

                <button
                  type="button"
                  className="secondary-button"
                  onClick={clearChat}
                  disabled={loading}
                >
                  Clear
                </button>

                {/* ASK AI */}

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

            {/* ERROR */}

            {error && (

              <p className="ai-error-message">
                {error}
              </p>

            )}

          </div>

        </div>

        {/* SUGGESTIONS */}

        <aside className="ai-suggestions-card">

          <h3>
            Try asking
          </h3>

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

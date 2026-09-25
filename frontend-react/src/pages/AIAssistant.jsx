
import { useRef, useState } from "react";


// FastAPI backend URL
const API_URL =
  import.meta.env.VITE_AI_API_URL ||
  "http://127.0.0.1:8000";


// Initial welcome message
const initialMessage = {
  role: "assistant",
  content:
    "Hello! I am your DevFlow X AI Assistant. " +
    "Ask me about React, FastAPI, MERN, programming, " +
    "or your software projects.",
};


function AiAssistant() {

  // Store all visible chat messages
  const [messages, setMessages] = useState([
    initialMessage,
  ]);

  // Store the current question
  const [question, setQuestion] = useState("");

  // Store messages for backend conversation history
  const [chatHistory, setChatHistory] = useState([]);

  // Loading state for AI response
  const [loading, setLoading] = useState(false);

  // AI health status
  const [healthStatus, setHealthStatus] =
    useState("Not checked");

  // Error message
  const [error, setError] = useState("");

  // Reference to textarea
  const textareaRef = useRef(null);


  // Add a message to the visible chat
  function addMessage(role, content) {

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        role: role,
        content: content,
      },
    ]);

  }


  // Check AI backend health
  async function checkAIHealth() {

    setHealthStatus("Checking...");
    setError("");

    try {

      const response = await fetch(
        `${API_URL}/api/ai/health`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Health check failed"
        );
      }

      if (data.status === "healthy") {

        setHealthStatus("AI service is healthy");

      } else {

        setHealthStatus(
          data.message || "AI service is not configured"
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
        "Make sure FastAPI is running."
      );

    }

  }


  // Send question to the AI backend
  async function askAI() {

    const trimmedQuestion = question.trim();

    // Do not send an empty question
    if (!trimmedQuestion) {

      setError("Please enter a question first.");

      return;

    }

    // Prevent multiple requests
    if (loading) {
      return;
    }

    // Clear previous error
    setError("");

    // Show user's question immediately
    addMessage(
      "user",
      trimmedQuestion
    );

    // Clear textarea
    setQuestion("");

    // Start loading
    setLoading(true);

    try {

      const response = await fetch(
        `${API_URL}/api/ai/chat`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            message: trimmedQuestion,
            history: chatHistory,
          }),
        }
      );

      const data = await response.json();

      // Handle backend errors
      if (!response.ok) {

        throw new Error(
          data.detail || "AI request failed"
        );

      }

      // Read AI response
      const aiReply =
        data.reply ||
        "The AI returned an empty response.";

      // Show AI response
      addMessage(
        "assistant",
        aiReply
      );

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
        "Sorry, I could not connect to the AI service. " +
        "Please check your FastAPI backend and API key.";

      setError(errorMessage);

      // Show error inside chat
      addMessage(
        "assistant",
        errorMessage
      );

    } finally {

      // Stop loading
      setLoading(false);

    }

  }


  // Handle Enter key
  function handleKeyDown(event) {

    // Enter sends the message
    // Shift + Enter creates a new line
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      askAI();

    }

  }


  // Fill textarea with a suggestion
  function useSuggestion(suggestion) {

    setQuestion(suggestion);
    setError("");

    // Focus the textarea after selecting suggestion
    setTimeout(() => {

      if (textareaRef.current) {
        textareaRef.current.focus();
      }

    }, 0);

  }


  // Clear visible conversation
  function clearChat() {

    setMessages([
      initialMessage,
    ]);

    setChatHistory([]);

    setQuestion("");

    setError("");

  }


  return (

    <div className="ai-assistant-page">

      {/* Page heading */}

      <div className="page-heading">

        <div>

          <p className="eyebrow">
            Workspace /
          </p>

          <h1>
            AI Assistant
          </h1>

          <p>
            Ask questions using the DevFlow X AI service.
          </p>

        </div>

      </div>


      {/* Health check section */}

      <div className="ai-health-row">

        <button
          type="button"
          className="primary-button"
          onClick={checkAIHealth}
        >
          Check AI Health
        </button>

        <span className="status-text">
          {healthStatus}
        </span>

      </div>


      {/* Main AI layout */}

      <div className="ai-layout">


        {/* Chat card */}

        <div className="ai-chat-card">


          {/* Chat header */}

          <div className="ai-card-header">

            <div className="ai-avatar">
              ✦
            </div>

            <div>

              <h2>
                DevFlow X Assistant
              </h2>

              <p>
                Your AI assistant for development and projects.
              </p>

            </div>

          </div>


          {/* Chat messages */}

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


            {/* Loading message */}

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


          {/* Chat input */}

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
              placeholder="Ask something about React, FastAPI, or MERN..."
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


            {/* Error message */}

            {error && (

              <p className="ai-error-message">
                {error}
              </p>

            )}

          </div>

        </div>


        {/* Suggestions card */}

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


export default AiAssistant;
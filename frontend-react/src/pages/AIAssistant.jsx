import {
  useRef,
  useState
} from "react";

import {
  testBackend,
  testFastAPI,
  checkAIHealth,
  askAI
} from "../services/aiApi";


// ==================================================
// INITIAL MESSAGE
// ==================================================

const initialMessage = {
  role: "assistant",

  content:
    "Hello! I am your DevFlow X AI Assistant. Ask me about React, FastAPI, MERN, programming, or your software projects."
};


// ==================================================
// AI ASSISTANT
// ==================================================

function AIAssistant() {

  const [messages, setMessages] =
    useState([
      initialMessage
    ]);


  const [question, setQuestion] =
    useState("");


  const [chatHistory, setChatHistory] =
    useState([]);


  const [loading, setLoading] =
    useState(false);


  const [healthStatus, setHealthStatus] =
    useState("Not checked");


  const [error, setError] =
    useState("");


  const textareaRef =
    useRef(null);


  // ==================================================
  // ADD MESSAGE
  // ==================================================

  function addMessage(
    role,
    content
  ) {

    setMessages(
      (previousMessages) => [
        ...previousMessages,

        {
          role,
          content
        }
      ]
    );
  }


  // ==================================================
  // TEST EXPRESS BACKEND
  // ==================================================

  async function checkBackend() {

    setHealthStatus(
      "Checking backend..."
    );

    setError("");


    try {

      const data =
        await testBackend();


      console.log(
        "Express backend:",
        data
      );


      setHealthStatus(
        "Express backend connected"
      );

    } catch (backendError) {

      console.error(
        "Backend error:",
        backendError
      );


      setHealthStatus(
        "Express backend offline"
      );


      setError(
        backendError.message ||
        "Unable to connect to Express backend."
      );
    }
  }


  // ==================================================
  // TEST EXPRESS → FASTAPI
  // ==================================================

  async function checkFastAPI() {

    setHealthStatus(
      "Testing FastAPI connection..."
    );

    setError("");


    try {

      const data =
        await testFastAPI();


      console.log(
        "FastAPI connection:",
        data
      );


      setHealthStatus(
        "Express → FastAPI connected"
      );

    } catch (fastAPIError) {

      console.error(
        "FastAPI error:",
        fastAPIError
      );


      setHealthStatus(
        "FastAPI connection failed"
      );


      setError(
        fastAPIError.message ||
        "Unable to connect to FastAPI."
      );
    }
  }


  // ==================================================
  // CHECK AI HEALTH
  // ==================================================

  async function handleAIHealth() {

    setHealthStatus(
      "Checking AI service..."
    );

    setError("");


    try {

      const data =
        await checkAIHealth();


      console.log(
        "AI health:",
        data
      );


      if (
        data.status === "healthy" ||
        data.status === "online" ||
        data.success === true
      ) {

        setHealthStatus(
          "AI service is healthy"
        );

      } else {

        setHealthStatus(
          data.message ||
          data.status ||
          "AI service connected"
        );
      }

    } catch (healthError) {

      console.error(
        "AI health error:",
        healthError
      );


      setHealthStatus(
        "AI service offline"
      );


      setError(
        healthError.message ||
        "Unable to connect to AI service."
      );
    }
  }


  // ==================================================
  // TEST ALL CONNECTIONS
  // ==================================================

  async function testAllConnections() {

    setHealthStatus(
      "Testing connections..."
    );

    setError("");


    try {

      await testBackend();


      await testFastAPI();


      const aiHealth =
        await checkAIHealth();


      console.log(
        "All connection tests:",
        aiHealth
      );


      setHealthStatus(
        "Frontend → Express → FastAPI → AI connected"
      );

    } catch (connectionError) {

      console.error(
        "Connection test error:",
        connectionError
      );


      setHealthStatus(
        "Connection test failed"
      );


      setError(
        connectionError.message ||
        "One or more services are unavailable."
      );
    }
  }


  // ==================================================
  // ASK AI
  // ==================================================

  async function handleAskAI() {

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


    // Show user message
    addMessage(
      "user",
      trimmedQuestion
    );


    // Clear input
    setQuestion("");


    // Start loading
    setLoading(true);


    try {

      console.log(
        "Sending AI request:",
        trimmedQuestion
      );


      const data =
        await askAI(
          trimmedQuestion,
          chatHistory
        );


      console.log(
        "AI response:",
        data
      );


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


      // Update history
      const updatedHistory = [

        ...chatHistory,

        {
          role: "user",
          content: trimmedQuestion
        },

        {
          role: "assistant",
          content: aiReply
        }

      ];


      // Keep latest 20 messages
      setChatHistory(
        updatedHistory.slice(-20)
      );


      setHealthStatus(
        "AI response received"
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

      handleAskAI();
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

      textareaRef
        .current
        ?.focus();

    }, 0);
  }


  // ==================================================
  // CLEAR CHAT
  // ==================================================

  function clearChat() {

    setMessages([
      initialMessage
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


      {/* CONNECTION BUTTONS */}

      <div className="ai-health-row">

        <button
          type="button"
          className="primary-button"
          onClick={testAllConnections}
          disabled={loading}
        >
          Test All Connections
        </button>


        <button
          type="button"
          className="primary-button"
          onClick={checkBackend}
          disabled={loading}
        >
          Test Backend
        </button>


        <button
          type="button"
          className="primary-button"
          onClick={checkFastAPI}
          disabled={loading}
        >
          Test FastAPI
        </button>


        <button
          type="button"
          className="primary-button"
          onClick={handleAIHealth}
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
                    message.role === "user"
                      ? "chat-message user-message"
                      : "chat-message assistant-message"
                  }
                >

                  <div className="message-label">

                    {message.role === "user"
                      ? "You"
                      : "DevFlow X AI"
                    }

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
                  onClick={handleAskAI}
                  disabled={
                    loading ||
                    !question.trim()
                  }
                >

                  {loading
                    ? "Thinking..."
                    : "Ask AI"
                  }

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

import { useState } from "react";

import {
  indexDocuments,
  askRAG
} from "../services/ragApi";


function RAGAssistant() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  async function handleIndexDocuments() {
    setLoading(true);
    setMessage("");
    setAnswer("");
    setSources([]);

    try {
      const data = await indexDocuments();

      setMessage(
        `${data.message}. Chunks: ${data.chunks}`
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }


  async function handleAskQuestion(event) {
    event.preventDefault();

    if (!question.trim()) {
      setMessage("Please enter a question.");
      return;
    }

    setLoading(true);
    setMessage("");
    setAnswer("");
    setSources([]);

    try {
      const data = await askRAG(question);

      setAnswer(data.answer);
      setSources(data.sources || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>RAG Assistant</h1>
          <p>
            Ask questions using your project documents.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={handleIndexDocuments}
          disabled={loading}
        >
          Index Documents
        </button>
      </div>


      <div className="card">
        <form onSubmit={handleAskQuestion}>
          <label htmlFor="rag-question">
            Ask a question
          </label>

          <textarea
            id="rag-question"
            value={question}
            onChange={(event) =>
              setQuestion(event.target.value)
            }
            placeholder="What technologies does DevFlow X use?"
            rows="5"
          />

          <button
            className="primary-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Processing..." : "Ask RAG Assistant"}
          </button>
        </form>

        {message && (
          <p className="info-message">
            {message}
          </p>
        )}

        {answer && (
          <div className="ai-answer">
            <h2>Answer</h2>
            <p>{answer}</p>

            {sources.length > 0 && (
              <>
                <h3>Sources</h3>

                <ul>
                  {sources.map((source) => (
                    <li key={source}>
                      {source}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


export default RAGAssistant;
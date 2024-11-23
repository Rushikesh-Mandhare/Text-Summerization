import React, { useState } from "react";
import "./Summarizer.css";

const Summarizer = () => {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [model, setModel] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState("");

  // Backend API URLs (realistic and professional-looking)
  const apiUrls = {
    basic: "https://localhost:5000/summarize-basic",
    attention: "https://localhost:5000/summarize-attention",
    bert: "https://localhost:5000/summarize-bert",
  };

  // Simulated backend interaction
  const backendSimulation = async (url, inputText) => {
    console.log(`Calling backend: ${url}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        const sentences = inputText.split(".").filter((s) => s.trim() !== "");
        let generatedSummary = "";
  
        if (url.includes("basic")) {
          // Basic model selects the first and last sentence
          generatedSummary =
            sentences.length > 1
              ? `${sentences[0].trim()}. ${sentences[sentences.length - 1].trim()}.`
              : sentences[0].trim() + ".";
        } else if (url.includes("attention")) {
          // Attention model picks every alternate sentence
          generatedSummary = sentences
            .filter((_, idx) => idx % 2 === 0)
            .slice(0, 4)
            .join(". ") + ".";
        } else if (url.includes("bert")) {
          // Improved BERT simulation: Select sentences with the most keywords
          const words = inputText.split(" ");
          const keywords = words
            .filter((_, idx) => idx % 5 === 0)
            .map((word) => word.toLowerCase());
  
          const rankedSentences = sentences
            .map((sentence) => {
              const matchCount = keywords.reduce(
                (count, keyword) => count + (sentence.toLowerCase().includes(keyword) ? 1 : 0),
                0
              );
              return { sentence, matchCount };
            })
            .sort((a, b) => b.matchCount - a.matchCount); // Rank by keyword matches
  
          generatedSummary = rankedSentences
            .slice(0, 2) // Top 2 sentences with the most keyword matches
            .map((item) => item.sentence.trim())
            .join(". ") + ".";
        }
  
        resolve(generatedSummary || "Summary not generated. Try different text.");
      }, 2000); // Simulate 2-second delay
    });
  };
  

  const handleSummarize = async () => {
    if (!text.trim()) {
      setSummary("Please enter some text to summarize.");
      return;
    }

    setLoading(true);
    setLoaderMessage(`Summarizing your text using the ${model.toUpperCase()} model...`);

    try {
      const summary = await backendSimulation(apiUrls[model], text);
      setSummary(summary);
    } catch (error) {
      setSummary("Error generating summary. Please try again later.");
    } finally {
      setLoading(false);
      setLoaderMessage("");
    }
  };

  return (
    <div className="container">
      <h1>Text Summarization App</h1>
      <textarea
        rows="8"
        placeholder="Enter text to summarize..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>

      {/* Model Selection */}
      <div className="radio-buttons">
        <label>
          <input
            type="radio"
            name="model"
            value="basic"
            checked={model === "basic"}
            onChange={() => setModel("basic")}
          />
          Basic Summarization
        </label>
        <label>
          <input
            type="radio"
            name="model"
            value="attention"
            checked={model === "attention"}
            onChange={() => setModel("attention")}
          />
          Attention Summarization
        </label>
        <label>
          <input
            type="radio"
            name="model"
            value="bert"
            checked={model === "bert"}
            onChange={() => setModel("bert")}
          />
          BERT-based Summarization
        </label>
      </div>

      <button onClick={handleSummarize} disabled={loading}>
        {loading ? "Summarizing..." : "Summarize"}
      </button>

      {/* Loader */}
      {loading && (
        <div className="loader">
          <div className="spinner"></div>
          <p>{loaderMessage}</p>
        </div>
      )}

      {/* Display Summary */}
      {summary && (
        <div className="summary">
          <h3>Summary:</h3>
          <p>{summary}</p>
        </div>
      )}

      <footer>© 2024 Text Summarization App</footer>
    </div>
  );
};

export default Summarizer;

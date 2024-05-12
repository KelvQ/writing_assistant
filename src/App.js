import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './App.css';

const API_KEY = process.env.REACT_APP_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

function formatFeedback(feedback) {
  return feedback
    .replace(/Grammar:/g, '\n\n**Grammar:**')
    .replace(/Clarity:/g, '\n\n**Clarity:**')
    .replace(/Organization:/g, '\n\n**Organization:**')
    .replace(/Improved Version:/g, '\n\n**Improved Version:**')
    .replace(/\*\*|\*/g, '')
    .replace(/\* /g, '\n* ')
    .trim();
}

function FeedbackContainer({ feedback }) {
  return (
    <div>
      {feedback.split('\n\n').map((section, index) => (
        <div key={index} style={{ fontWeight: 'bold', marginBottom: '10px' }}>
          {section}
        </div>
      ))}
    </div>
  );
}



function App() {
  const [inputText, setInputText] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  async function analyzeText() {
    setLoading(true);
    const prompt = `Grammar: Provide feedback on grammar as a whole.\n\nClarity: Provide feedback on clarity as a whole.\n\nOrganization: Provide feedback on organization as a whole.\n\nImproved Version: Offer an improved version if applicable.\n\nText for Feedback:\n${inputText}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    setFeedback(formatFeedback(text)); // Format feedback before setting it
    setLoading(false);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Writing Assistant</h1>
      </header>
      <main>
        <section id="input-section">
          <h2>Input Text</h2>
          <textarea
            id="input-text"
            placeholder="Enter your text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          ></textarea>
          <button id="analyze-button" onClick={analyzeText}>
            {loading ? 'Analyzing...' : 'Analyze Text'}
          </button>
        </section>
        <section id="feedback-section">
          <h2>Feedback</h2>
          <FeedbackContainer feedback={feedback} />
        </section>
      </main>
    </div>
  );
}

export default App;

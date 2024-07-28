"use client";

import { useState } from 'react';
import { useRouter } from 'next/router';
import FloatingLoginButton from '@/components/FloatingLoginButton';

const initialQuestions = [
  { question: "What is your age?", type: "long" },
  { question: "Why are you interested in improving your financial literacy?", type: "long" },
  { question: "How would you describe your current understanding of personal finance? (e.g., basic, intermediate, advanced)", type: "long" },
  { question: "Have you ever created a personal budget? If yes, how often do you use it?", type: "long" },
  { question: "Do you have any experience with investing? Please elaborate.", type: "long" },
  { question: "What financial topics are you most interested in learning about? (e.g., savings, investments, crypto, taxes)", type: "long" },
  { question: "How do you prefer to learn about finance? (e.g., videos, articles, interactive exercises)", type: "long" },
  { question: "What is your primary financial goal right now? (e.g., saving for a house, paying off debt, investing for retirement)", type: "long" },
  { question: "Have you ever taken any financial education courses or used financial apps before? If yes, which ones and how was your experience?", type: "long" },
  { question: "Do you have any specific questions or concerns about your finances that you'd like us to address in this app?", type: "long" }
];

export default function NewQuestionnaire() {
  const [questions, setQuestions] = useState(initialQuestions);
  const [responses, setResponses] = useState(Array(initialQuestions.length).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');
  const router = useRouter();

  const handleInputChange = (index, value) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const areAllResponsesFilled = () => {
    return responses.every(response => response.trim() !== '');
  };

  const handleSubmit = async () => {
    if (!areAllResponsesFilled()) {
      setError('Please fill in all the responses before submitting.');
      return;
    }
    console.log(responses);
    setLoading(true);
    setError('');
    setResult('');
    try {
      const res = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'evaluateLiteracy', questions, responses }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data.message);
        console.log(data.message);
        setResponses(Array(initialQuestions.length).fill('')); 
        
        router.push('/map'); // Changed from /mainPage to /map
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Failed to fetch data');
    }
    setLoading(false);
  };

  return (
    <div>
      <FloatingLoginButton/>
<div className='Universal'>
      <div className="container">
        <h1 className="title">Financial Literacy Questionnaire</h1>
        {questions.map((q, index) => (
          <div key={index} className="question-block">
            <label className="question-label">{q.question}</label>
            {q.type === "short" ? (
              <input
                type="text"
                value={responses[index]}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="input"
              />
            ) : (
              <textarea
                value={responses[index]}
                onChange={(e) => handleInputChange(index, e.target.value)}
                rows="4"
                className="textarea"
              />
            )}
          </div>
        ))}
        <button
          onClick={handleSubmit}
          className="submit-button"
        >
          Submit
        </button>
        {loading && <p className="loading-text">Loading...</p>}
        {error && <p className="error-text">{error}</p>}
      </div>

      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          min-height: 100vh;
          width: 100%;
          background-image: url('/background.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
        }
      `}</style>

      <style jsx>{`
        .Universal {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          width: 100%;
          padding: 20px;
          box-sizing: border-box;
        }

        .container {
          background-color: rgba(60, 60, 60, 0.9);
          width: 70%;
          margin: 20px auto;
          padding: 20px;
          border-radius: 15px;
          color: white;
        }

        .title {
          font-size: 40px;
          font-weight: bold;
          margin-bottom: 18px;
          text-align: center;
        }
        .question-block {
          margin-bottom: 20px;
        }
        .question-label {
          display: block;
          margin-bottom: 10px;
          font-weight: bold;
          margin-left: 5%;
          font-size: 20px; 
          color: rgba(245, 245, 245, 0.80);
        }
        .input, .textarea {
          width: 90%;
          margin-left: 5%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          outline: none;
          transition: border-color 0.3s;
          color: black; 
        }
        .input:focus, .textarea:focus {
          border-color: #0090f4;
        }
        .submit-button {
          width: 25%;
          margin-left: 37.5%;
          padding: 12px;
          background-color: #fff;
          color: black;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: background-color 0.3s;
          font-size: 21px; 
          font-weight:bold;
        }
        .submit-button:hover {
          background-color: lightgray;
        }
        .loading-text {
          text-align: center;
          color: #888;
          margin-top: 16px;
        }
        .error-text {
          text-align: center;
          color: red;
          margin-top: 16px;
        }

        @media (max-width: 768px) {
          .container {
            width: 90%;
          }
          .submit-button {
            width: 50%;
            margin-left: 25%;
          }
        }
      `}</style>
    </div>
    </div>
    
  );
}
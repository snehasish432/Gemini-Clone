import React, { useState } from "react";



const App = () => {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(true);

  const payload = {
    contents: [
      {
        parts: [{ text: question }],
      },
    ],
  };

  const askQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setResult(undefined);

    try {
      const response = await fetch(import.meta.env.VITE_GEMINI_KEY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await response.json();
      const answer = json?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

      setChatHistory([{ question, answer }, ...chatHistory]);
      setResult(answer);
    } catch (err) {
      console.error("Fetch error:", err);
      setResult("Something went wrong.");
    }

    setLoading(false);
    setQuestion("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") askQuestion();
  };

  const deleteHistory = (index) => {
    setChatHistory(chatHistory.filter((_, i) => i !== index));
  };

  const loadFromHistory = (item) => {
    setResult(item.answer);
    setQuestion("");
  };

  return (
    <div className={`${darkMode ? "bg-[#1e1e1e] text-white" : "bg-white text-black"} flex h-screen`}>
      
      <div className={`${darkMode ? "bg-[#2b2b2b] border-zinc-700" : "bg-gray-100 border-gray-300"} w-64 border-r p-4 overflow-y-auto`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Chat History</h2>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-sm px-2 py-1 rounded bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90"
          >
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>
        {chatHistory.length === 0 ? (
          <p className="text-sm text-gray-400">No chats yet...</p>
        ) : (
          chatHistory.map((chat, index) => (
            <div key={index} className="flex items-center justify-between mb-2 group">
              <button
                onClick={() => loadFromHistory(chat)}
                className="text-sm text-left text-blue-500 hover:underline w-full pr-2 truncate"
                title={chat.question}
              >
                {chat.question.length > 35
                  ? chat.question.slice(0, 35) + "..."
                  : chat.question}
              </button>
              <button
                onClick={() => deleteHistory(index)}
                className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-sm ml-2"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      
      <div className="flex flex-col flex-1 p-6">
        
        <h1 className="flex justify-center text-3xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Gemini Clone
        </h1>

        <div className={`${darkMode ? "bg-grey-900" : "bg-gray-100"} flex-1 overflow-auto p-6 rounded-xl shadow-inner border mb-10`}>
          {loading ? (
            <p className="text-gray-400">thinking...</p>
          ) : result ? (
            <div className="whitespace-pre-wrap">{result}</div>
          ) : (
            <p className="text-gray-400">Ask a question...</p>
          )}
        </div>

        
        <div className={`${darkMode ? "bg-[#333] border-zinc-600" : "bg-white border-gray-300"} flex items-center rounded-full px-4 py-2 border shadow mb-5 `}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            className={`flex-1 bg-transparent outline-none px-2 ${darkMode ? "text-white placeholder:text-zinc-400" : "text-black placeholder:text-gray-400"}`}
          />
          <button
            onClick={askQuestion}
            disabled={loading}
            className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full disabled:opacity-50 transition"
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;

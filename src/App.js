import "./App.css";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useState } from "react";

const App = () => {
  const [product, setProduct] = useState("");
  const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });

  const apiKey = "AIzaSyCKiGVT41_KLiZDh8IHSeWF50z-srr61EQ";
  const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const fetchProductRecommendation = async () => {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Based on the following user conversation, suggest me some list of items in point wise max 10 and min 5 in point wise just product name do not give me any explanation just product name with point:\n"${transcript}"`,
                },
              ],
            },
          ],
        }),
      });

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No recommendation found.";
      setProduct(reply);
    } catch (error) {
      console.error("Error fetching product recommendation:", error);
      setProduct("Failed to fetch recommendation.");
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser does not support speech recognition.</span>;
  }

  return (
    <>
      <div className="container">
        <h2>Suggestify</h2>
        <br />
        <p>
          🎙️ Just speak naturally into your phone — our system records the conversation and intelligently recommends the best products for you.
          <br />
          💡 No buttons, no typing — just your voice.
          <br />
          🛍️ From thoughts to things, instantly.
        </p>

        <div className="main-content">
          {transcript || "Start speaking to get suggestions..."}
        </div>

        <div className="btn-style">
          <button onClick={startListening}>Start Listening</button>
          <button onClick={SpeechRecognition.stopListening}>Stop Listening</button>
          <button onClick={fetchProductRecommendation}>Get Recommendation</button>
        </div>

        <br />
        <div className="main-content">
          <strong>
          Recommend product Based on Conversation:</strong>
          <div>{product}</div>
        </div>
      </div>
    </>
  );
};

export default App;

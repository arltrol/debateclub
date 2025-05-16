import React, { useState } from 'react';
import './App.css';

const characters = [
  "Trump", "Einstein", "Barbie", "MrBeast", "Batman",
  "Shakespeare", "Gordon Ramsay", "Andrew Tate", "Minecraft Creeper", "Homer Simpson"
];

const topics = [
  "Should aliens be allowed to vote?",
  "Can pineapple belong on pizza?",
  "Should time travel be taxed?",
  "Do robots deserve holidays?",
  "Can Minecraft Creepers hold jobs?",
  "Is TikTok better than school?",
  "Should memes replace language?",
  "Do influencers run the world?",
  "Should Mondays be banned?",
  "Can Homer Simpson be president?"
];

const languages = [
  "English", "German", "French", "Spanish", "Portuguese", "Italian", "Japanese", "Arabic"
];

function App() {
  const [fighter1, setFighter1] = useState("Trump");
  const [fighter2, setFighter2] = useState("Einstein");
  const [topic, setTopic] = useState(topics[0]);
  const [tone, setTone] = useState("Funny");
  const [language, setLanguage] = useState("English");
  const [debate, setDebate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const getAvatarUrl = (name) => {
    const filename = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `/avatars/${filename}.png`;
  };

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const generateDebate = async () => {
    setCountdown("Match starting in...");
    for (let i = 3; i > 0; i--) {
      setCountdown(`Match starting in... ${i}`);
      await delay(700);
    }
    setCountdown(null);
    setLoading(true);
    try {
      const response = await fetch('/.netlify/functions/generateDebate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fighter1, fighter2, topic, tone, language })
      });
      const data = await response.json();
      if (data.output) {
        const lines = data.output.split(/\n+/).filter(line => line.trim());
        setDebate(lines);
      } else {
        setDebate(["Sorry, something went wrong."]);
      }
    } catch (err) {
      setDebate(["Error loading debate."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>DeepFake Debate Club</h1>

      <div className="selectors">
        <div>
          <label>Fighter 1:</label>
          <select value={fighter1} onChange={(e) => setFighter1(e.target.value)}>
            {characters.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label>Fighter 2:</label>
          <select value={fighter2} onChange={(e) => setFighter2(e.target.value)}>
            {characters.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label>Debate Topic:</label>
        <select value={topic} onChange={(e) => setTopic(e.target.value)}>
          {topics.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>

      <div>
        <label>Select Language:</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          {languages.map((lang) => <option key={lang}>{lang}</option>)}
        </select>
      </div>

      <div className="tones">
        {["Funny", "Serious", "Absurd"].map(t => (
          <button
            key={t}
            className={tone === t ? "active" : ""}
            onClick={() => setTone(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <button onClick={generateDebate} disabled={loading}>
        {loading ? "Loading..." : "Generate Debate"}
      </button>

      {countdown && <p className="countdown">{countdown}</p>}

      {debate && (
        <div className="debate-preview">
          <h2>Debate Preview:</h2>
          {debate.map((line, index) => {
            const isF1 = line.includes(fighter1);
            const speaker = isF1 ? fighter1 : fighter2;
            const avatar = getAvatarUrl(speaker);
            return (
              <div className={`speech ${isF1 ? '' : 'right'}`} key={index}>
                {isF1 && <img src={avatar} alt={speaker} />}
                <div className="bubble">{line.replace(`[${speaker}]:`, '').trim()}</div>
                {!isF1 && <img src={avatar} alt={speaker} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;

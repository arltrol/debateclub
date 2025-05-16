import React, { useState } from 'react';
import './App.css';

const fightersList = [
  "Trump",
  "Einstein",
  "Barbie",
  "MrBeast",
  "Homer Simpson",
  "Yoda",
  "Gordon Ramsay",
  "Batman",
  "Shakespeare",
  "Minecraft Creeper"
];

const topicsList = [
  "Should aliens be allowed to vote?",
  "Should pineapple be banned from pizza?",
  "Is TikTok better than school?",
  "Can Minecraft Creepers hold jobs?",
  "Should pets run for president?",
  "Do ghosts pay rent?",
  "Is cereal soup?",
  "Should memes be taught in schools?",
  "Can robots fall in love?",
  "Do aliens understand sarcasm?"
];

const languages = [
  "English",
  "French",
  "German",
  "Spanish",
  "Portuguese",
  "Italian",
  "Japanese",
  "Chinese",
  "Arabic"
];

function App() {
  const [fighter1, setFighter1] = useState("Trump");
  const [fighter2, setFighter2] = useState("Einstein");
  const [customFighter1, setCustomFighter1] = useState("");
  const [customFighter2, setCustomFighter2] = useState("");
  const [useCustomFighter1, setUseCustomFighter1] = useState(false);
  const [useCustomFighter2, setUseCustomFighter2] = useState(false);

  const [topic, setTopic] = useState(topicsList[0]);
  const [customTopic, setCustomTopic] = useState("");
  const [useCustomTopic, setUseCustomTopic] = useState(false);

  const [tone, setTone] = useState("Funny");
  const [language, setLanguage] = useState("English");
  const [debate, setDebate] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAvatarUrl = (name) => {
    const filename = name.toLowerCase().replace(/\s/g, '');
    return `/avatars/${filename}.png`;
  };

  const handleSurprise = () => {
    const randF1 = fightersList[Math.floor(Math.random() * fightersList.length)];
    let randF2 = fightersList[Math.floor(Math.random() * fightersList.length)];
    while (randF2 === randF1) randF2 = fightersList[Math.floor(Math.random() * fightersList.length)];
    const randTopic = topicsList[Math.floor(Math.random() * topicsList.length)];
    setUseCustomFighter1(false);
    setUseCustomFighter2(false);
    setFighter1(randF1);
    setFighter2(randF2);
    setUseCustomTopic(false);
    setTopic(randTopic);
    setTone("Funny");
    setLanguage("English");
    setDebate([]);
  };

  const generateDebate = async () => {
    const finalF1 = useCustomFighter1 ? customFighter1.trim() : fighter1;
    const finalF2 = useCustomFighter2 ? customFighter2.trim() : fighter2;
    const finalTopic = useCustomTopic ? customTopic.trim() : topic;

    if (!finalF1 || !finalF2 || !finalTopic) {
      alert("Please complete fighter names and topic.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/.netlify/functions/generateDebate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fighter1: finalF1, fighter2: finalF2, topic: finalTopic, tone, language })
      });
      const data = await res.json();
      if (data.output) {
        const lines = data.output.split(/\n+/).filter(Boolean);
        setDebate(lines);
      } else {
        setDebate(["[Error]: No response from AI."]);
      }
    } catch (err) {
      setDebate(["[Error]: Failed to fetch debate."]);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>DeepFake Debate Club</h1>

      <div className="selectors">
        <div>
          <label>Fighter 1: <input type="checkbox" checked={useCustomFighter1} onChange={() => setUseCustomFighter1(!useCustomFighter1)} /> Custom</label>
          {useCustomFighter1 ? (
            <input value={customFighter1} onChange={(e) => setCustomFighter1(e.target.value)} />
          ) : (
            <select value={fighter1} onChange={(e) => setFighter1(e.target.value)}>
              {fightersList.map(f => <option key={f}>{f}</option>)}
            </select>
          )}
        </div>

        <div>
          <label>Fighter 2: <input type="checkbox" checked={useCustomFighter2} onChange={() => setUseCustomFighter2(!useCustomFighter2)} /> Custom</label>
          {useCustomFighter2 ? (
            <input value={customFighter2} onChange={(e) => setCustomFighter2(e.target.value)} />
          ) : (
            <select value={fighter2} onChange={(e) => setFighter2(e.target.value)}>
              {fightersList.map(f => <option key={f}>{f}</option>)}
            </select>
          )}
        </div>
      </div>

      <div>
        <label>Debate Topic: <input type="checkbox" checked={useCustomTopic} onChange={() => setUseCustomTopic(!useCustomTopic)} /> Custom</label>
        {useCustomTopic ? (
          <input value={customTopic} onChange={(e) => setCustomTopic(e.target.value)} />
        ) : (
          <select value={topic} onChange={(e) => setTopic(e.target.value)}>
            {topicsList.map(t => <option key={t}>{t}</option>)}
          </select>
        )}
      </div>

      <div>
        <label>Select Language:</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          {languages.map(l => <option key={l}>{l}</option>)}
        </select>
      </div>

      <div className="tones">
        {['Funny', 'Serious', 'Absurd'].map(t => (
          <button
            key={t}
            className={tone === t ? "active" : ""}
            onClick={() => setTone(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <button className="generate-button" onClick={generateDebate} disabled={loading}>
        {loading ? "Generating..." : "Generate Debate"}
      </button>

      <button onClick={handleSurprise}>🎲 Surprise Me!</button>

      {debate.length > 0 && (
        <div className="debate-preview">
          <h2>Debate Preview:</h2>
          {debate.map((line, i) => {
            const name = i % 2 === 0
              ? (useCustomFighter1 ? customFighter1.trim() : fighter1)
              : (useCustomFighter2 ? customFighter2.trim() : fighter2);
            const avatarUrl = getAvatarUrl(name);
            const cleanLine = line.replace(/^\[.*?\]:?\s*/, '');

            return (
              <div key={i} className={`speech ${i % 2 === 0 ? '' : 'right'}`}>
                {i % 2 === 0 && <img src={avatarUrl} onError={(e) => e.target.style.display = 'none'} alt={name} />}
                <div className="bubble">{cleanLine}</div>
                {i % 2 !== 0 && <img src={avatarUrl} onError={(e) => e.target.style.display = 'none'} alt={name} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import './App.css';

const fightersList = [
  "Trump", "Shakespeare", "Barbie", "Gordon Ramsay", "MrBeast",
  "Andrew Tate", "Batman", "Minecraft Creeper", "Homer Simpson", "Yoda"
];

const topicsList = [
  "Should pineapple be banned from pizza?",
  "Can Minecraft Creepers hold jobs?",
  "Is Barbie a better leader than most presidents?",
  "Should Shakespeare write rap lyrics?",
  "Do aliens understand sarcasm?",
  "Is Yoda secretly a TikTok star?",
  "Would Homer Simpson survive in Batman’s world?",
  "Should pets be allowed on reality shows?",
  "Can Gordon Ramsay beat Barbie in a cook-off?",
  "Are influencers the new philosophers?"
];

const languages = [
  "English", "German", "French", "Spanish", "Portuguese", "Italian", "Dutch", "Japanese"
];

function App() {
  const [fighter1, setFighter1] = useState("Trump");
  const [fighter2, setFighter2] = useState("Einstein");
  const [useCustomFighter1, setUseCustomFighter1] = useState(false);
  const [useCustomFighter2, setUseCustomFighter2] = useState(false);
  const [customFighter1, setCustomFighter1] = useState("");
  const [customFighter2, setCustomFighter2] = useState("");

  const [topic, setTopic] = useState(topicsList[0]);
  const [useCustomTopic, setUseCustomTopic] = useState(false);
  const [customTopic, setCustomTopic] = useState("");

  const [tone, setTone] = useState("Funny");
  const [language, setLanguage] = useState("English");

  const [debateText, setDebateText] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAvatarUrl = (name) => {
    const filename = name.toLowerCase().replace(/\s/g, "");
    return `/avatars/${filename}.png`;
  };

  const Avatar = ({ name }) => {
    const url = getAvatarUrl(name);
    return (
      <img
        src={url}
        alt={name}
        onError={(e) => e.target.style.display = "none"}
      />
    );
  };

  const generateDebate = async () => {
    const f1 = useCustomFighter1 ? customFighter1 : fighter1;
    const f2 = useCustomFighter2 ? customFighter2 : fighter2;
    const debateTopic = useCustomTopic ? customTopic : topic;

    setLoading(true);
    try {
      const response = await fetch("/.netlify/functions/generateDebate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fighter1: f1, fighter2: f2, topic: debateTopic, tone, language })
      });
      const data = await response.json();
      if (data.output) {
        const lines = data.output.split(/\n+/).filter(line => line.trim());
        setDebateText(lines);
      } else {
        setDebateText(["No output received."]);
      }
    } catch (err) {
      setDebateText(["Something went wrong."]);
    } finally {
      setLoading(false);
    }
  };

  const surpriseMe = () => {
    setUseCustomFighter1(false);
    setUseCustomFighter2(false);
    setUseCustomTopic(false);

    const pick = (list) => list[Math.floor(Math.random() * list.length)];
    let f1 = pick(fightersList);
    let f2 = pick(fightersList);
    while (f1 === f2) f2 = pick(fightersList);
    setFighter1(f1);
    setFighter2(f2);
    setTopic(pick(topicsList));
    setTone(pick(["Funny", "Serious", "Absurd"]));
  };

  const shareLink = typeof window !== "undefined" ? window.location.href : "";

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
          {languages.map(lang => <option key={lang}>{lang}</option>)}
        </select>
      </div>

      <div className="tones">
        {["Funny", "Serious", "Absurd"].map(t => (
          <button
            key={t}
            className={tone === t ? "active" : ""}
            onClick={() => setTone(t)}
          >{t}</button>
        ))}
      </div>

      <button onClick={generateDebate} className="generate-button" disabled={loading}>
        {loading ? "Generating..." : "Generate Debate"}
      </button>

      <button onClick={surpriseMe}>🎲 Surprise Me!</button>

      {debateText.length > 0 && (
        <div className="debate-preview">
          <h2>Debate Preview:</h2>
          {debateText.map((line, i) => {
            const isLeft = i % 2 === 0;
            const name = isLeft
              ? (useCustomFighter1 ? customFighter1 : fighter1)
              : (useCustomFighter2 ? customFighter2 : fighter2);
            return (
              <div className={`speech ${isLeft ? "" : "right"}`} key={i}>
                {isLeft && <Avatar name={name} />}
                <div className="bubble">{line}</div>
                {!isLeft && <Avatar name={name} />}
              </div>
            );
          })}
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <button onClick={() => {
              navigator.clipboard.writeText(shareLink);
              alert("🔗 Link copied!");
            }}>
              🔗 Share This Debate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

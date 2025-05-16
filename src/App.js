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
  const [customFighter1, setCustomFighter1] = useState("");
  const [customFighter2, setCustomFighter2] = useState("");
  const [useCustomF1, setUseCustomF1] = useState(false);
  const [useCustomF2, setUseCustomF2] = useState(false);

  const [topic, setTopic] = useState(topics[0]);
  const [customTopic, setCustomTopic] = useState("");
  const [useCustomTopic, setUseCustomTopic] = useState(false);

  const [tone, setTone] = useState("Funny");
  const [language, setLanguage] = useState("English");
  const [debate, setDebate] = useState(null);
  const [loading, setLoading] = useState(false);

  const getName = (name, isCustom, customVal) => isCustom ? customVal || name : name;

  const getAvatarUrl = (name) => {
    const filename = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `/avatars/${filename}.png`;
  };

  const generateDebate = async () => {
    const fighterA = getName(fighter1, useCustomF1, customFighter1);
    const fighterB = getName(fighter2, useCustomF2, customFighter2);
    const selectedTopic = useCustomTopic ? customTopic : topic;

    const payload = {
      fighter1: fighterA,
      fighter2: fighterB,
      topic: selectedTopic,
      tone,
      language
    };

    console.log("🚀 Sending to API:", payload);
    setLoading(true);

    try {
      const response = await fetch('/.netlify/functions/generateDebate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (data.output) {
        const lines = data.output.split(/\n+/).filter(line => line.trim());
        setDebate(lines);
        updateShareLink(fighterA, fighterB, selectedTopic, tone, language);
      } else {
        console.error("❌ API returned:", data);
        setDebate(["Sorry, something went wrong."]);
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setDebate(["Error loading debate."]);
    } finally {
      setLoading(false);
    }
  };

  const updateShareLink = (f1, f2, topic, tone, lang) => {
    const url = new URL(window.location.href);
    url.searchParams.set("f1", f1);
    url.searchParams.set("f2", f2);
    url.searchParams.set("topic", topic);
    url.searchParams.set("tone", tone);
    url.searchParams.set("lang", lang);
    window.history.replaceState(null, "", url.toString());
  };

  const surpriseMe = () => {
    const r1 = characters[Math.floor(Math.random() * characters.length)];
    let r2;
    do {
      r2 = characters[Math.floor(Math.random() * characters.length)];
    } while (r1 === r2);

    const rTopic = topics[Math.floor(Math.random() * topics.length)];
    const rTone = ["Funny", "Serious", "Absurd"][Math.floor(Math.random() * 3)];

    setFighter1(r1);
    setFighter2(r2);
    setTopic(rTopic);
    setTone(rTone);
    setUseCustomF1(false);
    setUseCustomF2(false);
    setUseCustomTopic(false);
    setDebate(null);
  };

  return (
    <div className="container">
      <h1>DeepFake Debate Club</h1>

      <div className="selectors">
        <div>
          <label>Fighter 1: <input type="checkbox" checked={useCustomF1} onChange={() => setUseCustomF1(!useCustomF1)} /> Custom</label>
          {useCustomF1 ? (
            <input value={customFighter1} onChange={(e) => setCustomFighter1(e.target.value)} />
          ) : (
            <select value={fighter1} onChange={(e) => setFighter1(e.target.value)}>
              {characters.map((c) => <option key={c}>{c}</option>)}
            </select>
          )}
        </div>

        <div>
          <label>Fighter 2: <input type="checkbox" checked={useCustomF2} onChange={() => setUseCustomF2(!useCustomF2)} /> Custom</label>
          {useCustomF2 ? (
            <input value={customFighter2} onChange={(e) => setCustomFighter2(e.target.value)} />
          ) : (
            <select value={fighter2} onChange={(e) => setFighter2(e.target.value)}>
              {characters.map((c) => <option key={c}>{c}</option>)}
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
            {topics.map((t) => <option key={t}>{t}</option>)}
          </select>
        )}
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

   <button className="generate-button" onClick={generateDebate} disabled={loading}>
  {loading ? <span className="spinner">⏳ Generating...</span> : "Generate Debate"}
</button>

      <button onClick={surpriseMe}>🎲 Surprise Me!</button>

      {debate && (
        <div className="debate-preview">
          <h2>Debate Preview:</h2>
          {debate.map((line, index) => {
            const speakerMatch = line.match(/\[(.*?)\]:/);
            const speaker = speakerMatch ? speakerMatch[1] : "";
            const avatar = getAvatarUrl(speaker);
            return (
              <div className={`speech ${speaker === getName(fighter1, useCustomF1, customFighter1) ? '' : 'right'}`} key={index}>
                <img
                  src={avatar}
                  alt={speaker}
                  onError={(e) => e.target.style.display = 'none'}
                />
                <div className="bubble">{line.replace(`[${speaker}]:`, '').trim()}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;

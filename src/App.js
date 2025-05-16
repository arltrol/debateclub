import React, { useState } from 'react';
import './App.css';

const characters = [
  "Trump", "Shakespeare", "Barbie", "Gordon Ramsay", "MrBeast",
  "Batman", "Minecraft Creeper", "Homer Simpson", "Yoda", "Elon Musk"
];

const topics = [
  "Should aliens be allowed to vote?",
  "Can pineapple belong on pizza?",
  "Should AI run for president?",
  "Do Minecraft Creepers hold jobs?",
  "Are memes the new form of literature?",
  "Should homework be abolished?",
  "Do cats secretly control the internet?",
  "Can TikTok replace school?",
  "Should robots be allowed to marry?",
  "Is cereal a soup?"
];

const languages = [
  "English", "German", "French", "Spanish", "Portuguese", "Italian", "Japanese", "Chinese"
];

function App() {
  const [fighter1, setFighter1] = useState("Trump");
  const [fighter2, setFighter2] = useState("Einstein");
  const [customFighter1, setCustomFighter1] = useState("");
  const [customFighter2, setCustomFighter2] = useState("");
  const [useCustomFighter1, setUseCustomFighter1] = useState(false);
  const [useCustomFighter2, setUseCustomFighter2] = useState(false);

  const [topic, setTopic] = useState(topics[0]);
  const [customTopic, setCustomTopic] = useState("");
  const [useCustomTopic, setUseCustomTopic] = useState(false);

  const [tone, setTone] = useState("Funny");
  const [language, setLanguage] = useState("English");

  const [debateText, setDebateText] = useState(null);
  const [loading, setLoading] = useState(false);

  const getAvatarUrl = (name) => {
    const fileName = name.toLowerCase().replace(/[^a-z0-9]/gi, '');
    return `/avatars/${fileName}.png`;
  };

  const Avatar = ({ name }) => {
    const avatarPath = getAvatarUrl(name);
    return (
      <img
        src={avatarPath}
        alt={name}
        onError={(e) => {
          e.target.onerror = null;
          e.target.replaceWith(document.createTextNode(name));
        }}
      />
    );
  };

  const generateDebate = async () => {
    const fighter1Name = useCustomFighter1 ? customFighter1 : fighter1;
    const fighter2Name = useCustomFighter2 ? customFighter2 : fighter2;
    const debateTopic = useCustomTopic ? customTopic : topic;

    setLoading(true);
    try {
      const response = await fetch("/.netlify/functions/generateDebate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fighter1: fighter1Name, fighter2: fighter2Name, topic: debateTopic, tone, language })
      });
      const data = await response.json();
      if (data.output) {
        const lines = data.output.split(/\n+/).filter(line => line.trim());
        setDebateText(lines);
      } else {
        setDebateText(["Sorry, something went wrong."]);
      }
    } catch (err) {
      setDebateText(["Error calling debate function."]);
    } finally {
      setLoading(false);
    }
  };

  const surpriseMe = () => {
    const r1 = characters[Math.floor(Math.random() * characters.length)];
    let r2;
    do { r2 = characters[Math.floor(Math.random() * characters.length)]; } while (r1 === r2);
    const rt = topics[Math.floor(Math.random() * topics.length)];
    const rl = languages[Math.floor(Math.random() * languages.length)];
    setFighter1(r1);
    setFighter2(r2);
    setTopic(rt);
    setLanguage(rl);
    setUseCustomFighter1(false);
    setUseCustomFighter2(false);
    setUseCustomTopic(false);
  };

  return (
    <div className="container">
      <h1>DeepFake Debate Club</h1>

      <div className="selectors">
        <div>
          <label>Fighter 1: <input type="checkbox" checked={useCustomFighter1} onChange={() => setUseCustomFighter1(!useCustomFighter1)} /> Custom</label>
          {useCustomFighter1 ? (
            <input value={customFighter1} onChange={e => setCustomFighter1(e.target.value)} />
          ) : (
            <select value={fighter1} onChange={e => setFighter1(e.target.value)}>
              {characters.map(c => <option key={c}>{c}</option>)}
            </select>
          )}
        </div>

        <div>
          <label>Fighter 2: <input type="checkbox" checked={useCustomFighter2} onChange={() => setUseCustomFighter2(!useCustomFighter2)} /> Custom</label>
          {useCustomFighter2 ? (
            <input value={customFighter2} onChange={e => setCustomFighter2(e.target.value)} />
          ) : (
            <select value={fighter2} onChange={e => setFighter2(e.target.value)}>
              {characters.map(c => <option key={c}>{c}</option>)}
            </select>
          )}
        </div>
      </div>

      <div>
        <label>Debate Topic: <input type="checkbox" checked={useCustomTopic} onChange={() => setUseCustomTopic(!useCustomTopic)} /> Custom</label>
        {useCustomTopic ? (
          <input value={customTopic} onChange={e => setCustomTopic(e.target.value)} />
        ) : (
          <select value={topic} onChange={e => setTopic(e.target.value)}>
            {topics.map(t => <option key={t}>{t}</option>)}
          </select>
        )}
      </div>

      <div>
        <label>Select Language:</label>
        <select value={language} onChange={e => setLanguage(e.target.value)}>
          {languages.map(l => <option key={l}>{l}</option>)}
        </select>
      </div>

      <div className="tones">
        {["Funny", "Serious", "Absurd"].map(t => (
          <button key={t} className={tone === t ? "active" : ""} onClick={() => setTone(t)}>{t}</button>
        ))}
      </div>

      <button className="generate-button" onClick={generateDebate} disabled={loading}>
        {loading ? "Generating..." : "Generate Debate"}
      </button>
      <button onClick={surpriseMe}>🎲 Surprise Me!</button>

      {debateText && (
        <div className="debate-preview">
          <h2>Debate Preview:</h2>
          {debateText.map((line, i) => {
            const match = line.match(/^\[(.+?)\]/);
            const name = match ? match[1].trim() : (i % 2 === 0 ? fighter1 : fighter2);
            const cleanLine = line.replace(/^\[.+?\]:?\s*/, '');
            return (
              <div className={`speech ${i % 2 === 0 ? '' : 'right'}`} key={i}>
                {i % 2 === 0 && <Avatar name={name} />}
                <div className="bubble">{cleanLine}</div>
                {i % 2 !== 0 && <Avatar name={name} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;

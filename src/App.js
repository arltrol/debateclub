import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [fighters, setFighters] = useState([]);
  const [topics, setTopics] = useState([]);
  const [useCustomFighter1, setUseCustomFighter1] = useState(false);
  const [useCustomFighter2, setUseCustomFighter2] = useState(false);
  const [useCustomTopic, setUseCustomTopic] = useState(false);
  const [fighter1, setFighter1] = useState('');
  const [fighter2, setFighter2] = useState('');
  const [tone, setTone] = useState("Funny");
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState("English");
  const [debateText, setDebateText] = useState(null);
  const [loading, setLoading] = useState(false);

  const getAvatarUrl = (name) => `/avatars/${name.toLowerCase().replace(/ /g, '')}.png`;

  useEffect(() => {
    fetch('/fighters.txt')
      .then(res => res.text())
      .then(text => {
        const list = text.trim().split('\n');
        setFighters(list);
        setFighter1(list[0] || '');
        setFighter2(list[1] || '');
      });

    fetch('/topics.txt')
      .then(res => res.text())
      .then(text => {
        const list = text.trim().split('\n');
        setTopics(list);
        setTopic(list[0] || '');
      });
  }, []);

  const generateDebate = async () => {
    if (!fighter1 || !fighter2 || !topic) return;
    setLoading(true);
    try {
      const response = await fetch("/.netlify/functions/generateDebate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fighter1, fighter2, topic, tone, language })
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
    const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const f1 = rand(fighters);
    let f2 = rand(fighters);
    while (f2 === f1) f2 = rand(fighters);
    setFighter1(f1);
    setFighter2(f2);
    setTopic(rand(topics));
    setTone(rand(["Funny", "Serious", "Absurd"]));
    setLanguage(rand(["English", "Spanish", "German", "French", "Italian", "Portuguese", "Japanese"]));
    setUseCustomFighter1(false);
    setUseCustomFighter2(false);
    setUseCustomTopic(false);
    generateDebate();
  };

  return (
    <div className="container">
      <h1>DeepFake Debate Club</h1>

      <div className="selectors">
        <div>
          <label>Fighter 1:</label>
          <div>
            <label><input type="checkbox" checked={useCustomFighter1} onChange={() => setUseCustomFighter1(!useCustomFighter1)} /> Custom</label>
          </div>
          {useCustomFighter1 ? (
            <input type="text" value={fighter1} onChange={(e) => setFighter1(e.target.value)} maxLength={30} placeholder="Enter fighter name" />
          ) : (
            <select value={fighter1} onChange={(e) => setFighter1(e.target.value)}>
              {fighters.map((char) => <option key={char} value={char}>{char}</option>)}
            </select>
          )}
        </div>
        <div>
          <label>Fighter 2:</label>
          <div>
            <label><input type="checkbox" checked={useCustomFighter2} onChange={() => setUseCustomFighter2(!useCustomFighter2)} /> Custom</label>
          </div>
          {useCustomFighter2 ? (
            <input type="text" value={fighter2} onChange={(e) => setFighter2(e.target.value)} maxLength={30} placeholder="Enter fighter name" />
          ) : (
            <select value={fighter2} onChange={(e) => setFighter2(e.target.value)}>
              {fighters.map((char) => <option key={char} value={char}>{char}</option>)}
            </select>
          )}
        </div>
      </div>

      <div>
        <label>Debate Topic:</label>
        <div>
          <label><input type="checkbox" checked={useCustomTopic} onChange={() => setUseCustomTopic(!useCustomTopic)} /> Custom</label>
        </div>
        {useCustomTopic ? (
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} maxLength={100} placeholder="Enter debate topic" />
        ) : (
          <select value={topic} onChange={(e) => setTopic(e.target.value)}>
            {topics.map((t) => <option key={t}>{t}</option>)}
          </select>
        )}
      </div>

      <div>
        <label>Select Language:</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          {["English", "Spanish", "German", "French", "Italian", "Portuguese", "Japanese"].map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
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

      <button className="generate-button" onClick={surpriseMe} disabled={loading} style={{ marginTop: '10px', backgroundColor: '#555' }}>
        🎲 Surprise Me!
      </button>

      {debateText && (
        <div className="debate-preview">
          <h2>Debate Preview:</h2>
          {debateText.map((line, index) => {
            const match = line.match(/^\[?(.*?)\]?:/);
            const speaker = match ? match[1].trim() : (index % 2 === 0 ? fighter1 : fighter2);
            const isF1 = speaker === fighter1;
            const avatar = getAvatarUrl(speaker);
            const textOnly = line.replace(/^\[?(.*?)\]?:/, '').trim();

            return (
              <div className={`speech ${isF1 ? '' : 'right'}`} key={index}>
                {isF1 && <img src={avatar} alt={speaker} loading="lazy" />}
                <div className="bubble">{textOnly}</div>
                {!isF1 && <img src={avatar} alt={speaker} loading="lazy" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;

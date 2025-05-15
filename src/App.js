import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [fighters, setFighters] = useState([]);
  const [topics, setTopics] = useState([]);
  const [fighter1, setFighter1] = useState('');
  const [fighter2, setFighter2] = useState('');
  const [tone, setTone] = useState("Funny");
  const [topic, setTopic] = useState('');
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
    setLoading(true);
    try {
      const response = await fetch("/.netlify/functions/generateDebate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fighter1, fighter2, topic, tone })
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

  return (
    <div className="container">
      <h1>DeepFake Debate Club</h1>

      <div className="selectors">
        <div>
          <label>Choose Fighter 1:</label>
          <select value={fighter1} onChange={(e) => setFighter1(e.target.value)}>
            {fighters.map((char) => <option key={char} value={char}>{char}</option>)}
          </select>
        </div>
        <div>
          <label>Choose Fighter 2:</label>
          <select value={fighter2} onChange={(e) => setFighter2(e.target.value)}>
            {fighters.map((char) => <option key={char} value={char}>{char}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label>Pick a Debate Topic:</label>
        <select value={topic} onChange={(e) => setTopic(e.target.value)}>
          {topics.map((t) => <option key={t}>{t}</option>)}
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

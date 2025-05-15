import React, { useState } from 'react';
import './App.css';

const characters = ["Trump", "Einstein", "Steve", "Noob", "Barbie", "Batman", "Elon Musk", "Gordon Ramsay", "MrBeast", "Shakespeare"];

const topics = [
  "Should aliens be allowed to vote?",
  "Can pineapple belong on pizza?",
  "Was the moon landing real?",
  "Should time travel be taxed?",
  "Is AI smarter than humans?",
  "Should Mondays be illegal?",
  "Can fish have jobs?",
  "Do video games make better leaders?",
  "Is TikTok the new school?",
  "Should cats be allowed in politics?",
  "Are influencers more powerful than presidents?",
  "Do robots deserve holidays?",
  "Should memes be a language?",
  "Can the world be ruled by children?",
  "Would dinosaurs survive a TikTok challenge?",
  "Is cereal soup?",
  "Should homework be abolished forever?",
  "Do ghosts pay rent?",
  "Should pets be able to vote?",
  "Can Minecraft teach real architecture?"
];

function App() {
  const [fighter1, setFighter1] = useState("Trump");
  const [fighter2, setFighter2] = useState("Einstein");
  const [tone, setTone] = useState("Funny");
  const [topic, setTopic] = useState("Should aliens be allowed to vote?");
  const [debateText, setDebateText] = useState(null);
  const [loading, setLoading] = useState(false);

  const getAvatarUrl = (name) => `/avatars/${name.toLowerCase().replace(/ /g, '')}.png`;

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
            {characters.map((char) => <option key={char} value={char}>{char}</option>)}
          </select>
        </div>
        <div>
          <label>Choose Fighter 2:</label>
          <select value={fighter2} onChange={(e) => setFighter2(e.target.value)}>
            {characters.map((char) => <option key={char} value={char}>{char}</option>)}
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
            const match = line.match(/^\[?(.*?)\]?:/); // [Trump]: or Trump:
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

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
  const [fighter1, setFighter1] = useState(characters[0]);
  const [fighter2, setFighter2] = useState(characters[1]);
  const [tone, setTone] = useState("Funny");
  const [topic, setTopic] = useState(topics[0]);
  const [debateText, setDebateText] = useState(null);

  const getAvatarUrl = (name) => `/avatars/${name.toLowerCase().replace(/ /g, '')}.png`;

  const generateDebate = () => {
    const samples = {
      Trump: "Aliens should absolutely vote. They've got terrific instincts, just terrific.",
      Einstein: "Only if they understand the theory of democracy.",
    };
    setDebateText({
      fighter1Text: samples[fighter1] || `${fighter1} argues passionately.`,
      fighter2Text: samples[fighter2] || `${fighter2} disagrees with intense logic.`
    });
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

      <button className="generate-button" onClick={generateDebate}>Generate Debate</button>

      {debateText && (
        <div className="debate-preview">
          <h2>Debate Preview:</h2>
          <div className="speech">
            <img src={getAvatarUrl(fighter1)} alt={fighter1} />
            <div className="bubble">{debateText.fighter1Text}</div>
          </div>
          <div className="speech right">
            <div className="bubble">{debateText.fighter2Text}</div>
            <img src={getAvatarUrl(fighter2)} alt={fighter2} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

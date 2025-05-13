import React, { useState } from 'react';

const characters = ["Trump", "Einstein", "Steve", "Noob"];
const topics = ["Should aliens be allowed to vote?", "Can pineapple belong on pizza?"];
const tones = ["Funny", "Serious", "Absurd"];

function App() {
  const [fighter1, setFighter1] = useState(characters[0]);
  const [fighter2, setFighter2] = useState(characters[1]);
  const [topic, setTopic] = useState(topics[0]);
  const [tone, setTone] = useState(tones[0]);
  const [debateText, setDebateText] = useState("");

  const generateDebate = () => {
    setDebateText(`${fighter1} debates ${fighter2} about "${topic}" in a ${tone} tone.`);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', backgroundColor: '#1a1a2e', color: 'white', minHeight: '100vh' }}>
      <h1>DeepFake Debate Club</h1>
      <div>
        <label>Choose Your Fighters:</label>
        <select onChange={(e) => setFighter1(e.target.value)} value={fighter1}>
          {characters.map((char) => (
            <option key={char} value={char}>{char}</option>
          ))}
        </select>
        <select onChange={(e) => setFighter2(e.target.value)} value={fighter2}>
          {characters.map((char) => (
            <option key={char} value={char}>{char}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Pick a Debate Topic:</label>
        <select onChange={(e) => setTopic(e.target.value)} value={topic}>
          {topics.map((top) => (
            <option key={top} value={top}>{top}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Tone:</label>
        {tones.map((t) => (
          <button key={t} onClick={() => setTone(t)}>{t}</button>
        ))}
      </div>
      <button onClick={generateDebate}>Generate Debate</button>
      <div>
        <h2>Debate Preview:</h2>
        <p>{debateText}</p>
      </div>
    </div>
  );
}

export default App;

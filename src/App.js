import React, { useState, useEffect } from "react";
import "./App.css";

const defaultFighters = [
  "Trump", "Barbie", "Gordon Ramsay", "Yoda", "Minecraft Creeper",
  "Homer Simpson", "Andrew Tate", "Noob", "Einstein", "MrBeast"
];

const defaultTopics = [
  "Should TikTok replace school?", "Is cereal a soup?",
  "Who would win in a fistfight: Barbie or Batman?",
  "Can Minecraft Creepers hold jobs?", "Are hot dogs sandwiches or chaos?",
  "Should AI be allowed to date humans?", "Is Gordon Ramsay actually a Jedi?",
  "Can Noobs run for president?", "Do aliens understand sarcasm?",
  "Would Einstein survive in a MrBeast challenge?"
];

const languages = [
  "English", "Spanish", "German", "French", "Italian", "Portuguese", "Japanese"
];

function App() {
  const [fighter1, setFighter1] = useState("Trump");
  const [fighter2, setFighter2] = useState("Einstein");
  const [customFighter1, setCustomFighter1] = useState("");
  const [customFighter2, setCustomFighter2] = useState("");
  const [useCustomFighter1, setUseCustomFighter1] = useState(false);
  const [useCustomFighter2, setUseCustomFighter2] = useState(false);

  const [topic, setTopic] = useState(defaultTopics[0]);
  const [customTopic, setCustomTopic] = useState("");
  const [useCustomTopic, setUseCustomTopic] = useState(false);

  const [tone, setTone] = useState("Funny");
  const [language, setLanguage] = useState("English");

  const [debateText, setDebateText] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shareLink, setShareLink] = useState("");

  const getAvatarUrl = (name) => `/avatars/${name.toLowerCase().replace(/ /g, "")}.png`;

  const Avatar = ({ name }) => {
    const [imgError, setImgError] = useState(false);
    const url = getAvatarUrl(name);
    return imgError ? (
      <div className="initials">{name}</div>
    ) : (
      <img src={url} alt={name} onError={() => setImgError(true)} />
    );
  };

  const buildURLParams = () => {
    const params = new URLSearchParams({
      fighter1: useCustomFighter1 ? customFighter1 : fighter1,
      fighter2: useCustomFighter2 ? customFighter2 : fighter2,
      topic: useCustomTopic ? customTopic : topic,
      tone,
      language,
      custom1: useCustomFighter1,
      custom2: useCustomFighter2,
      customTopic: useCustomTopic
    });
    return `${window.location.origin}?${params.toString()}`;
  };

  const parseURLParams = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("fighter1")) {
      setUseCustomFighter1(params.get("custom1") === "true");
      setUseCustomFighter2(params.get("custom2") === "true");
      setUseCustomTopic(params.get("customTopic") === "true");

      if (params.get("custom1") === "true") setCustomFighter1(params.get("fighter1"));
      else setFighter1(params.get("fighter1"));

      if (params.get("custom2") === "true") setCustomFighter2(params.get("fighter2"));
      else setFighter2(params.get("fighter2"));

      if (params.get("customTopic") === "true") setCustomTopic(params.get("topic"));
      else setTopic(params.get("topic"));

      setTone(params.get("tone") || "Funny");
      setLanguage(params.get("language") || "English");

      setTimeout(() => {
        generateDebate(params.get("fighter1"), params.get("fighter2"), params.get("topic"), params.get("tone"), params.get("language"));
      }, 500);
    }
  };

  useEffect(() => {
    parseURLParams();
  }, []);

  const generateDebate = async (
    f1 = useCustomFighter1 ? customFighter1 : fighter1,
    f2 = useCustomFighter2 ? customFighter2 : fighter2,
    t = useCustomTopic ? customTopic : topic,
    toneVal = tone,
    langVal = language
  ) => {
    if (!f1 || !f2 || !t) {
      setDebateText(["Please fill in all fields."]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/.netlify/functions/generateDebate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fighter1: f1, fighter2: f2, topic: t, tone: toneVal, language: langVal })
      });
      const data = await response.json();
      if (data.output) {
        const lines = data.output.split(/\n+/).filter((line) => line.trim());
        setDebateText(lines);
        setShareLink(buildURLParams());
      } else {
        setDebateText(["Something went wrong."]);
      }
    } catch {
      setDebateText(["Error generating debate."]);
    } finally {
      setLoading(false);
    }
  };

  const surpriseMe = () => {
    const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
    setUseCustomFighter1(false);
    setUseCustomFighter2(false);
    setUseCustomTopic(false);
    setFighter1(rand(defaultFighters));
    setFighter2(rand(defaultFighters));
    setTopic(rand(defaultTopics));
    setTone(rand(["Funny", "Serious", "Absurd"]));
    setLanguage(rand(languages));
    generateDebate();
  };

  return (
    <div className="container">
      <h1>DeepFake Debate Club</h1>

      <div className="selectors">
        <div>
          <label>
            Fighter 1:
            <input type="checkbox" checked={useCustomFighter1} onChange={() => setUseCustomFighter1(!useCustomFighter1)} /> Custom
          </label>
          {useCustomFighter1 ? (
            <input value={customFighter1} onChange={(e) => setCustomFighter1(e.target.value)} />
          ) : (
            <select value={fighter1} onChange={(e) => setFighter1(e.target.value)}>
              {defaultFighters.map((f) => <option key={f}>{f}</option>)}
            </select>
          )}
        </div>

        <div>
          <label>
            Fighter 2:
            <input type="checkbox" checked={useCustomFighter2} onChange={() => setUseCustomFighter2(!useCustomFighter2)} /> Custom
          </label>
          {useCustomFighter2 ? (
            <input value={customFighter2} onChange={(e) => setCustomFighter2(e.target.value)} />
          ) : (
            <select value={fighter2} onChange={(e) => setFighter2(e.target.value)}>
              {defaultFighters.map((f) => <option key={f}>{f}</option>)}
            </select>
          )}
        </div>
      </div>

      <div>
        <label>
          Debate Topic:
          <input type="checkbox" checked={useCustomTopic} onChange={() => setUseCustomTopic(!useCustomTopic)} /> Custom
        </label>
        {useCustomTopic ? (
          <input value={customTopic} onChange={(e) => setCustomTopic(e.target.value)} />
        ) : (
          <select value={topic} onChange={(e) => setTopic(e.target.value)}>
            {defaultTopics.map((t) => <option key={t}>{t}</option>)}
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
        {["Funny", "Serious", "Absurd"].map((t) => (
          <button key={t} className={tone === t ? "active" : ""} onClick={() => setTone(t)}>{t}</button>
        ))}
      </div>

      <button className="generate-button" onClick={() => generateDebate()} disabled={loading}>
        {loading ? "Generating..." : "Generate Debate"}
      </button>

      <button className="surprise-button" onClick={surpriseMe}>🎲 Surprise Me!</button>

      {debateText.length > 0 && (
        <div className="debate-preview">
          <h2>Debate Preview:</h2>
          {debateText.map((line, i) => {
            const match = line.match(/^\[?(.+?)\]?:/);
            const speaker = match ? match[1].trim() : (i % 2 === 0 ? (useCustomFighter1 ? customFighter1 : fighter1) : (useCustomFighter2 ? customFighter2 : fighter2));
            return (
              <div className={`speech ${i % 2 === 0 ? "" : "right"}`} key={i}>
                <Avatar name={speaker} />
                <div className="bubble">{line.replace(/^\[?.+?\]?:/, "").trim()}</div>
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

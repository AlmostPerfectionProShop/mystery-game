import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './index.css';

const randomDraw = (min, max, duration = 3000, callback) => {
  let interval;
  const start = Date.now();
  const draw = () => Math.floor(Math.random() * (max - min + 1)) + min;

  const tick = () => {
    const now = Date.now();
    if (now - start >= duration) {
      clearInterval(interval);
      callback(draw());
    }
  };

  interval = setInterval(tick, 50);
};

const GameBox = ({ label, value, onDraw, disabled }) => (
  <div className="game-box">
    <div className="game-label">{label}</div>
    <motion.div
      className="game-value"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 0.5 }}
    >
      {value ?? '--'}
    </motion.div>
    <button onClick={onDraw} disabled={disabled || value !== null}>
      Draw
    </button>
  </div>
);

const MysteryGame = () => {
  const [leagueName, setLeagueName] = useState('My League');
  const [minScore, setMinScore] = useState(100);
  const [prizes, setPrizes] = useState(['$10', '$20', '$30']);
  const [gameScores, setGameScores] = useState([null, null, null]);
  const [drawing, setDrawing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [lightMode, setLightMode] = useState(true);
  const [showSetup, setShowSetup] = useState(true);

  const drawGame = (index) => {
    if (drawing) return;
    setDrawing(true);
    randomDraw(minScore, 300, 3000, (score) => {
      const newScores = [...gameScores];
      newScores[index] = score;
      setGameScores(newScores);
      setDrawing(false);
    });
  };

  const total = gameScores.every((v) => v !== null)
    ? gameScores.reduce((a, b) => a + b, 0)
    : null;

  const reset = () => setGameScores([null, null, null]);

  return (
    <div className={lightMode ? 'light-mode' : 'dark-mode'}>
      {showSetup ? (
        <div className="setup-screen">
          <h1>Setup Mystery Game</h1>
          <input
            placeholder="League Name"
            value={leagueName}
            onChange={(e) => setLeagueName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Minimum Score"
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
          />
          <div className="prize-inputs">
            {prizes.map((prize, i) => (
              <input
                key={i}
                value={prize}
                onChange={(e) => {
                  const newPrizes = [...prizes];
                  newPrizes[i] = e.target.value;
                  setPrizes(newPrizes);
                }}
              />
            ))}
          </div>
          <button onClick={() => setShowSetup(false)}>Start Game</button>
        </div>
      ) : (
        <div className="game-screen">
          <h1>{leagueName}</h1>
          <div className="games-row">
            {[0, 1, 2].map((i) => (
              <GameBox
                key={i}
                label={`Game ${i + 1}`}
                value={gameScores[i]}
                onDraw={() => drawGame(i)}
                disabled={i > 0 && gameScores[i - 1] === null}
              />
            ))}
          </div>
          <div className="series-display">
            <strong>Mystery Series:</strong> {total ?? '--'}
          </div>
          <div className="button-row">
            <button onClick={() => setEditing(!editing)}>
              {editing ? 'Done Editing' : 'Edit Prizes'}
            </button>
            <label>
              <input
                type="checkbox"
                checked={!lightMode}
                onChange={() => setLightMode(!lightMode)}
              />
              Dark Mode
            </label>
            <button onClick={reset}>Reset Drawing</button>
            <button onClick={() => setShowSetup(true)}>Settings</button>
          </div>
          {editing && (
            <div className="prizes-row">
              {prizes.map((p, i) => (
                <div key={i} className="prize-item">
                  Game {i + 1}: {p}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MysteryGame;

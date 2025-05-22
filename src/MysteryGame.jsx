// Mystery Game Drawing Web App

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function MysteryGame() {
  const [leagueName, setLeagueName] = useState("Mystery Game Drawing");
  const [minScore, setMinScore] = useState(125);
  const [prizes, setPrizes] = useState({ g1: 0, g2: 0, g3: 0, series: 0 });
  const [drawnScores, setDrawnScores] = useState({ g1: null, g2: null, g3: null });
  const [isDrawing, setIsDrawing] = useState({ g1: false, g2: false, g3: false });
  const [showSetup, setShowSetup] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const randomScore = () => Math.floor(Math.random() * (300 - minScore + 1)) + minScore;

  const drawGame = (gameKey) => {
    setIsDrawing((prev) => ({ ...prev, [gameKey]: true }));
    let frame = 0;
    const interval = setInterval(() => {
      const score = randomScore();
      setDrawnScores((prev) => ({ ...prev, [gameKey]: score }));
      frame++;
      if (frame >= 30) {
        clearInterval(interval);
        setIsDrawing((prev) => ({ ...prev, [gameKey]: false }));
      }
    }, 100);
  };

  const reset = () => {
    setDrawnScores({ g1: null, g2: null, g3: null });
  };

  const canDraw = (key) => {
    if (key === "g1") return !drawnScores.g1;
    if (key === "g2") return drawnScores.g1 && !drawnScores.g2;
    if (key === "g3") return drawnScores.g2 && !drawnScores.g3;
    return false;
  };

  const seriesTotal =
    drawnScores.g1 && drawnScores.g2 && drawnScores.g3
      ? drawnScores.g1 + drawnScores.g2 + drawnScores.g3
      : null;

  const themeClasses = darkMode
    ? "bg-black text-white"
    : "bg-white text-black";

  if (showSetup) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${themeClasses}`}>
        <h1 className="text-3xl font-bold mb-4">Setup Mystery Game</h1>
        <label className="mb-1">League Name</label>
        <Input
          placeholder="League Name"
          value={leagueName}
          onChange={(e) => setLeagueName(e.target.value)}
          className="mb-2 w-64"
        />
        <label className="mb-1">Minimum Score (e.g., 125)</label>
        <Input
          placeholder="Minimum Score"
          type="number"
          value={minScore}
          onChange={(e) => setMinScore(Number(e.target.value))}
          className="mb-2 w-64"
        />
        {['g1', 'g2', 'g3', 'series'].map((key) => (
          <div key={key} className="w-64 mb-2">
            <label className="block mb-1">{`${key === 'series' ? 'Series' : 'Game ' + key[1]} Prize`}</label>
            <Input
              type="number"
              value={prizes[key]}
              onChange={(e) => setPrizes((p) => ({ ...p, [key]: Number(e.target.value) }))}
            />
          </div>
        ))}
        <div className="flex items-center gap-2 mt-4">
          <Button onClick={() => setShowSetup(false)}>Start Drawing</Button>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={darkMode} onChange={() => setDarkMode((d) => !d)} />
            <span>{darkMode ? "Dark Mode" : "Light Mode"}</span>
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 flex flex-col items-center justify-center ${themeClasses}`}>
      <h1 className="text-4xl font-bold mb-2 text-center">{leagueName}</h1>
      <p className="text-lg mb-8 text-center">
        Drawing random bowling scores between {minScore} and 300
      </p>

      <div className="flex flex-col space-y-6 items-center">
        <div className="flex flex-row justify-center gap-12 mb-6">
          {['g1', 'g2', 'g3'].map((key) => (
            <div key={key} className="text-center">
              <div className="text-xl font-semibold mb-1">
                Game {key[1]} - ${prizes[key]}
              </div>
              <div className="text-5xl font-bold h-16">
                {drawnScores[key] !== null ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {drawnScores[key]}
                  </motion.div>
                ) : (
                  "--"
                )}
              </div>
              <Button
                className="mt-2"
                onClick={() => drawGame(key)}
                disabled={!canDraw(key) || isDrawing[key]}
              >
                Draw Game {key[1]}
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-2">
          <div className="text-xl font-semibold mb-1">
            Mystery Series - ${prizes.series}
          </div>
          <div className="text-5xl font-bold h-16">
            {seriesTotal !== null ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {seriesTotal}
              </motion.div>
            ) : (
              "--"
            )}
          </div>
        </div>

        <div className="flex flex-row gap-4 justify-center mt-6">
          <Button onClick={reset}>Reset Drawing</Button>
          <Button variant="outline" onClick={() => setShowSettings((s) => !s)}>
            {showSettings ? "Hide Settings" : "Edit Prizes"}
          </Button>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={darkMode} onChange={() => setDarkMode((d) => !d)} />
            <span>{darkMode ? "Dark Mode" : "Light Mode"}</span>
          </label>
        </div>

        {showSettings && (
          <div className="mt-4">
            {['g1', 'g2', 'g3', 'series'].map((key) => (
              <div key={key} className="mb-2">
                <label className="block mb-1">{`${key === 'series' ? 'Series' : 'Game ' + key[1]} Prize`}</label>
                <Input
                  type="number"
                  value={prizes[key]}
                  onChange={(e) => setPrizes((p) => ({ ...p, [key]: Number(e.target.value) }))}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

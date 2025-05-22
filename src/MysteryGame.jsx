import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// --- Mock UI Components (Replace with your actual UI library components if available) ---
// These are simple functional components to make the app runnable.
// In a real project using Shadcn UI or similar, these would be imported from your UI library.

const Button = ({ children, onClick, disabled, variant = "default", className = "" }) => {
  let baseClasses = "px-4 py-2 rounded-md font-medium transition-colors duration-200";
  let variantClasses = "";

  switch (variant) {
    case "outline":
      variantClasses = "border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800";
      break;
    case "default":
    default:
      variantClasses = "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed";
      break;
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Input = ({ placeholder, value, onChange, type = "text", className = "" }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${className}`}
    />
  );
};

const CardContent = ({ children, className = "" }) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};
// --- End Mock UI Components ---

export default function App() {
  const [leagueName, setLeagueName] = useState("Mystery Game Drawing");
  const [minScore, setMinScore] = useState(125);
  const [prizes, setPrizes] = useState({ g1: 0, g2: 0, g3: 0, series: 0 });
  const [drawnScores, setDrawnScores] = useState({ g1: null, g2: null, g3: null });
  const [isDrawing, setIsDrawing] = useState({ g1: false, g2: false, g3: false });
  const [showSetup, setShowSetup] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Function to generate a random score within the defined range
  const randomScore = () => Math.floor(Math.random() * (300 - minScore + 1)) + minScore;

  // Function to simulate drawing a game score with a rolling animation
  const drawGame = (gameKey) => {
    setIsDrawing((prev) => ({ ...prev, [gameKey]: true })); // Set drawing state to true for the specific game
    let frame = 0; // Initialize frame counter for animation
    const interval = setInterval(() => {
      const score = randomScore(); // Generate a random score
      setDrawnScores((prev) => ({ ...prev, [gameKey]: score })); // Update the displayed score
      frame++;
      if (frame >= 30) { // After 30 frames (3 seconds), stop the animation
        clearInterval(interval); // Clear the interval
        setIsDrawing((prev) => ({ ...prev, [gameKey]: false })); // Set drawing state back to false
      }
    }, 100); // Update every 100 milliseconds
  };

  // Function to reset all drawn scores
  const reset = () => {
    setDrawnScores({ g1: null, g2: null, g3: null });
    setShowSettings(false); // Hide settings on reset for a cleaner UI
  };

  // Function to determine if a game can be drawn (sequential drawing)
  const canDraw = (key) => {
    if (key === "g1") return !drawnScores.g1; // Can draw G1 if it hasn't been drawn
    if (key === "g2") return drawnScores.g1 && !drawnScores.g2; // Can draw G2 if G1 is drawn and G2 isn't
    if (key === "g3") return drawnScores.g2 && !drawnScores.g3; // Can draw G3 if G2 is drawn and G3 isn't
    return false;
  };

  // Calculate the series total if all three game scores are drawn
  const seriesTotal =
    drawnScores.g1 !== null && drawnScores.g2 !== null && drawnScores.g3 !== null
      ? drawnScores.g1 + drawnScores.g2 + drawnScores.g3
      : null;

  // Determine theme classes based on darkMode state
  const themeClasses = darkMode
    ? "bg-gray-900 text-white"
    : "bg-white text-gray-900";

  // Render setup screen if showSetup is true
  if (showSetup) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${themeClasses} transition-colors duration-300`}>
        <h1 className="text-4xl font-extrabold mb-6 text-center">Setup Mystery Game</h1>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md space-y-5">
          <div className="space-y-2">
            <label htmlFor="leagueName" className="block text-lg font-semibold text-gray-700 dark:text-gray-200">League Name</label>
            <Input
              id="leagueName"
              placeholder="e.g., Friday Night Bowlers"
              value={leagueName}
              onChange={(e) => setLeagueName(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="minScore" className="block text-lg font-semibold text-gray-700 dark:text-gray-200">Minimum Score (e.g., 125)</label>
            <Input
              id="minScore"
              placeholder="Minimum Score"
              type="number"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <h2 className="text-2xl font-bold mt-6 mb-4 text-center text-gray-800 dark:text-gray-100">Set Prizes</h2>
          {['g1', 'g2', 'g3', 'series'].map((key) => (
            <div key={key} className="space-y-2">
              <label htmlFor={`prize-${key}`} className="block text-md font-medium text-gray-700 dark:text-gray-200">
                {`${key === 'series' ? 'Series' : `Game ${key[1]}`} Prize ($)`}
              </label>
              <Input
                id={`prize-${key}`}
                type="number"
                value={prizes[key]}
                onChange={(e) => setPrizes((p) => ({ ...p, [key]: Number(e.target.value) }))}
                className="w-full"
              />
            </div>
          ))}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Button onClick={() => setShowSetup(false)} className="w-full sm:w-auto">Start Drawing</Button>
            <label className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-200">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode((d) => !d)}
                className="form-checkbox h-5 w-5 text-blue-600 rounded"
              />
              <span className="text-lg">{darkMode ? "Dark Mode" : "Light Mode"}</span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  // Render main drawing screen
  return (
    <div className={`min-h-screen p-4 flex flex-col items-center justify-center ${themeClasses} transition-colors duration-300`}>
      <h1 className="text-5xl font-extrabold mb-4 text-center leading-tight">{leagueName}</h1>
      <p className="text-xl mb-12 text-center text-gray-600 dark:text-gray-300">
        Drawing random bowling scores between <span className="font-bold">{minScore}</span> and <span className="font-bold">300</span>
      </p>

      <div className="flex flex-col space-y-10 items-center w-full max-w-4xl">
        {/* Game Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {['g1', 'g2', 'g3'].map((key) => (
            <div key={key} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center justify-between transition-transform transform hover:scale-105">
              <div className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                Game {key[1]}
              </div>
              <div className="text-lg font-semibold mb-4 text-gray-600 dark:text-gray-300">
                Prize: ${prizes[key]}
              </div>
              <div className="text-7xl font-extrabold h-24 flex items-center justify-center text-blue-600 dark:text-blue-400">
                {isDrawing[key] ? (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.1 }}
                  >
                    {drawnScores[key] !== null ? drawnScores[key] : "--"}
                  </motion.div>
                ) : (
                  drawnScores[key] !== null ? (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                    >
                      {drawnScores[key]}
                    </motion.div>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-600">--</span>
                  )
                )}
              </div>
              <Button
                className="mt-6 w-full py-3 text-lg"
                onClick={() => drawGame(key)}
                disabled={!canDraw(key) || isDrawing[key]}
              >
                {isDrawing[key] ? "Drawing..." : `Draw Game ${key[1]}`}
              </Button>
            </div>
          ))}
        </div>

        {/* Mystery Series Total */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md text-center transition-transform transform hover:scale-105">
          <div className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">
            Mystery Series Total
          </div>
          <div className="text-xl font-semibold mb-4 text-gray-600 dark:text-gray-300">
            Prize: ${prizes.series}
          </div>
          <div className="text-8xl font-extrabold h-32 flex items-center justify-center text-green-600 dark:text-green-400">
            {seriesTotal !== null ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, type: "spring", stiffness: 100, delay: 0.2 }}
              >
                {seriesTotal}
              </motion.div>
            ) : (
              <span className="text-gray-400 dark:text-gray-600">---</span>
            )}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-8 w-full max-w-lg">
          <Button onClick={reset} className="flex-1 py-3 text-lg bg-red-600 hover:bg-red-700">Reset Drawing</Button>
          <Button variant="outline" onClick={() => setShowSettings((s) => !s)} className="flex-1 py-3 text-lg border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-700">
            {showSettings ? "Hide Prizes" : "Edit Prizes"}
          </Button>
          <label className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-200 flex-1 justify-center py-3">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode((d) => !d)}
              className="form-checkbox h-5 w-5 text-blue-600 rounded"
            />
            <span className="text-lg">{darkMode ? "Dark Mode" : "Light Mode"}</span>
          </label>
        </div>

        {/* Prize Settings Overlay (if shown) */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md space-y-5 relative">
              <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">Edit Prizes</h2>
              {['g1', 'g2', 'g3', 'series'].map((key) => (
                <div key={key} className="space-y-2">
                  <label htmlFor={`edit-prize-${key}`} className="block text-md font-medium text-gray-700 dark:text-gray-200">
                    {`${key === 'series' ? 'Series' : `Game ${key[1]}`} Prize ($)`}
                  </label>
                  <Input
                    id={`edit-prize-${key}`}
                    type="number"
                    value={prizes[key]}
                    onChange={(e) => setPrizes((p) => ({ ...p, [key]: Number(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              ))}
              <Button onClick={() => setShowSettings(false)} className="mt-6 w-full py-3 text-lg">Close</Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

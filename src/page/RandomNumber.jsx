import React, { useState, useEffect, useRef } from "react";
import { Play, Settings, RotateCcw, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const App = () => {
  // Configuration state
  const [config, setConfig] = useState({
    minNumber: 1,
    maxNumber: 100,
    winnersCount: 3,
    animationSpeed: 50, // ms between number changes during animation
    drawDelay: 1000, // ms delay between drawing each winner
  });

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentNumber, setCurrentNumber] = useState(0);
  const [winners, setWinners] = useState([]);
  const [drawHistory, setDrawHistory] = useState([]);

  // Refs for animation control
  const animationInterval = useRef(null);
  const drawTimeout = useRef(null);

  // Generate a random number within the configured range
  const getRandomNumber = () => {
    return (
      Math.floor(Math.random() * (config.maxNumber - config.minNumber + 1)) +
      config.minNumber
    );
  };

  // Start the drawing process
  const startDrawing = () => {
    if (isDrawing) return;

    setIsDrawing(true);
    setWinners([]);

    // Clear any existing animations
    if (animationInterval.current) clearInterval(animationInterval.current);
    if (drawTimeout.current) clearTimeout(drawTimeout.current);

    // Start animation for first winner
    startAnimation(0);
  };

  // Start animation for a specific winner index
  const startAnimation = (winnerIndex) => {
    // Rapidly change numbers to create spinning effect
    animationInterval.current = setInterval(() => {
      setCurrentNumber(getRandomNumber());
    }, config.animationSpeed);

    // After a delay, stop animation and select winner
    drawTimeout.current = setTimeout(() => {
      // Stop the spinning animation
      if (animationInterval.current) {
        clearInterval(animationInterval.current);
        animationInterval.current = null;
      }

      // Select the final winning number
      const winnerNumber = getRandomNumber();
      setCurrentNumber(winnerNumber);

      // Add winner to the list
      const newWinners = [...winners, winnerNumber];
      setWinners(newWinners);

      // If we still need more winners, start next animation
      if (winnerIndex + 1 < config.winnersCount) {
        setTimeout(() => startAnimation(winnerIndex + 1), config.drawDelay);
      } else {
        // All winners selected, finish drawing
        setIsDrawing(false);
        // Add to history
        setDrawHistory((prev) => [
          ...prev,
          {
            winners: newWinners,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      }
    }, 2000 + winnerIndex * 500); // Longer animation for first winner
  };

  // Reset the drawing
  const resetDrawing = () => {
    setIsDrawing(false);
    setWinners([]);
    setCurrentNumber(0);
    if (animationInterval.current) clearInterval(animationInterval.current);
    if (drawTimeout.current) clearTimeout(drawTimeout.current);
  };

  // Update config values
  const updateConfig = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: parseInt(value) || 0 }));
  };

  // Handle config form submission
  const handleConfigSubmit = (e) => {
    e.preventDefault();
    resetDrawing();
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (animationInterval.current) clearInterval(animationInterval.current);
      if (drawTimeout.current) clearTimeout(drawTimeout.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
            Undian Berhadiah
          </h1>
          <p className="text-gray-600">
            Sistem pengundian nomor pemenang dengan animasi menarik
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 h-full">
              <div className="flex items-center mb-6">
                <Settings className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-800">Konfigurasi</h2>
              </div>

              <form onSubmit={handleConfigSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jumlah Pemenang
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={config.winnersCount}
                    onChange={(e) =>
                      updateConfig("winnersCount", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Terkecil
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={config.minNumber}
                    onChange={(e) => updateConfig("minNumber", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Terbesar
                  </label>
                  <input
                    type="number"
                    min={config.minNumber + 1}
                    value={config.maxNumber}
                    onChange={(e) => updateConfig("maxNumber", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kecepatan Animasi (ms)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="200"
                    step="10"
                    value={config.animationSpeed}
                    onChange={(e) =>
                      updateConfig("animationSpeed", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jeda Antar Pemenang (ms)
                  </label>
                  <input
                    type="number"
                    min="500"
                    max="5000"
                    step="100"
                    value={config.drawDelay}
                    onChange={(e) => updateConfig("drawDelay", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Reset Konfigurasi
                </button>
              </form>

              {/* Draw history */}
              {drawHistory.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-bold text-gray-800 mb-3">
                    Riwayat Undian
                  </h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {drawHistory.slice(-5).map((draw, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-3 rounded-lg border border-gray-200"
                      >
                        <div className="text-xs text-gray-500 mb-1">
                          {draw.timestamp}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {draw.winners.map((num, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-sm font-medium"
                            >
                              #{num}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Drawing Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 h-full">
              {/* Main display */}
              <div className="bg-gradient-to-br from-indigo-900 to-purple-800 rounded-2xl p-8 text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  {isDrawing
                    ? "Sedang Mengundi..."
                    : "Nomor Sedang Ditampilkan"}
                </h2>

                <div className="relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentNumber}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1.2, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-7xl md:text-8xl font-bold text-yellow-400 mb-4 font-mono"
                    >
                      {currentNumber.toString().padStart(2, "0")}
                    </motion.div>
                  </AnimatePresence>

                  <div className="absolute inset-0 rounded-2xl bg-white bg-opacity-10 animate-pulse"></div>
                </div>

                <div className="flex justify-center space-x-4 mt-6">
                  {!isDrawing ? (
                    <button
                      onClick={startDrawing}
                      disabled={
                        config.winnersCount <= 0 ||
                        config.maxNumber <= config.minNumber
                      }
                      className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded-xl flex items-center transition duration-300 transform hover:scale-105"
                    >
                      <Play className="h-6 w-6 mr-2" />
                      Mulai Undian
                    </button>
                  ) : (
                    <button
                      onClick={resetDrawing}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-xl flex items-center transition duration-300"
                    >
                      <RotateCcw className="h-6 w-6 mr-2" />
                      Batalkan
                    </button>
                  )}
                </div>
              </div>

              {/* Winners display */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Trophy className="h-6 w-6 text-amber-500 mr-2" />
                  {winners.length > 0
                    ? `Pemenang (${winners.length}/${config.winnersCount})`
                    : "Pemenang"}
                </h3>

                {winners.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {winners.map((winner, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                          scale: [0, 1.2, 1],
                          opacity: [0, 1, 1],
                        }}
                        transition={{
                          duration: 0.8,
                          delay: index * 0.3,
                        }}
                        className="bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl p-4 text-center shadow-lg"
                      >
                        <div className="text-sm text-amber-100">
                          Pemenang #{index + 1}
                        </div>
                        <div className="text-3xl font-bold text-white mt-1 font-mono">
                          {winner.toString().padStart(2, "0")}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-xl p-8 text-center">
                    <p className="text-gray-500">
                      Belum ada pemenang. Tekan tombol "Mulai Undian" untuk
                      memulai pengundian.
                    </p>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h3 className="font-bold text-blue-800 mb-2">
                  Bagaimana Cara Kerjanya?
                </h3>
                <ul className="text-blue-700 space-y-2 list-disc pl-5">
                  <li>Atur konfigurasi pengundian di panel sebelah kiri</li>
                  <li>
                    Tekan tombol "Mulai Undian" untuk memulai proses pengundian
                  </li>
                  <li>
                    Nomor akan berputar secara acak dan berhenti pada nomor
                    pemenang
                  </li>
                  <li>
                    Proses berulang hingga mencapai jumlah pemenang yang
                    ditentukan
                  </li>
                  <li>Riwayat undian akan disimpan di panel konfigurasi</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

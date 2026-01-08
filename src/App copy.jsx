import React, { useState, useRef, useEffect } from "react";
import {
  Printer,
  RotateCcw,
  Trophy,
  Users,
  Play,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const App = () => {
  // State untuk konfigurasi
  const [totalNumbers, setTotalNumbers] = useState(50);
  const [winnersCount, setWinnersCount] = useState(3);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winners, setWinners] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(null);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [showScreen, setShowScreen] = useState(false);

  // Generate nomor undian
  const generateNumbers = () => {
    const nums = Array.from({ length: totalNumbers }, (_, i) => i + 1);
    setSelectedNumbers(nums);
  };

  useEffect(() => {
    generateNumbers();
  }, [totalNumbers]);

  // Reset semua
  const resetAll = () => {
    setWinners([]);
    setCurrentNumber(null);
    setIsSpinning(false);
    generateNumbers();
  };

  // Fungsi spin
  const spinWheel = async () => {
    if (isSpinning || selectedNumbers.length === 0) return;

    setIsSpinning(true);
    setWinners([]);

    // Simulasi multi-spin dengan delay
    let remaining = [...selectedNumbers];
    const newWinners = [];

    const spinInterval = setInterval(async () => {
      if (remaining.length === 0 || newWinners.length >= winnersCount) {
        clearInterval(spinInterval);
        setIsSpinning(false);
        return;
      }

      // Pilih nomor acak
      const randomIndex = Math.floor(Math.random() * remaining.length);
      const winner = remaining[randomIndex];
      newWinners.push(winner);
      setCurrentNumber(winner);

      // Hapus dari daftar tersedia
      remaining = remaining.filter((n) => n !== winner);

      // Update state setiap 2 detik
      setWinners([...newWinners]);
    }, 5000);
  };

  // Cetak nomor undian
  const printNumbers = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Nomor Undian</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
          .number { 
            border: 1px solid #333; 
            padding: 10px; 
            text-align: center; 
            font-size: 14px;
            border-radius: 4px;
          }
          h1 { text-align: center; color: #1f2937; }
        </style>
      </head>
      <body>
        <h1>🎫 Nomor Undian</h1>
        <div class="grid">
          ${selectedNumbers
            .map((n) => `<div class="number">#${n}</div>`)
            .join("")}
        </div>
      </body>
      </html>
    `;

    const win = window.open("", "", "width=800,height=600");
    win.document.write(printContent);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  return (
    <>
      <div className={"w-full p-4" + " " + (!showScreen ? "" : "hidden")}>
        <motion.header
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            🎡 Sistem Undian Digital
          </h1>
          <p className="text-gray-600">
            Cetak nomor & lakukan pengundian secara transparan
          </p>
        </motion.header>
        <div className="flex items-center justify-center">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl p-6 flex-grow"
          >
            <div className="flex items-center justify-between gap-2 mb-6">
              <div>
                <Settings className="text-indigo-600" size={24} />
                <h2 className="text-xl font-semibold text-gray-800">
                  Konfigurasi
                </h2>
              </div>
              <div>
                <button
                  onClick={() => setShowScreen(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Show Screen
                </button>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Nomor Undian
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={totalNumbers}
                  onChange={(e) =>
                    setTotalNumbers(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jumlah Pemenang
                </label>
                <input
                  type="number"
                  min="1"
                  max={totalNumbers}
                  value={winnersCount}
                  onChange={(e) =>
                    setWinnersCount(
                      Math.min(
                        totalNumbers,
                        Math.max(1, parseInt(e.target.value) || 1)
                      )
                    )
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={printNumbers}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Printer size={18} />
                  Cetak Nomor
                </button>
                <button
                  onClick={resetAll}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                  <RotateCcw size={18} />
                  Reset
                </button>
              </div>
            </div>

            {/* Preview Nomor */}
            <div className="mt-8">
              <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Users size={18} />
                {selectedNumbers.length} Nomor Tersedia
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto border">
                <div className="grid grid-cols-6 gap-2">
                  {selectedNumbers.slice(0, 24).map((num) => (
                    <span
                      key={num}
                      className={`text-center text-xs py-1.5 rounded ${
                        winners.includes(num)
                          ? "bg-green-500 text-white font-bold"
                          : "bg-white text-gray-700 border"
                      }`}
                    >
                      #{num}
                    </span>
                  ))}
                  {selectedNumbers.length > 24 && (
                    <span className="text-center text-xs py-1.5 bg-gray-200 rounded col-span-6">
                      +{selectedNumbers.length - 24} nomor lainnya
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        <motion.footer
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-gray-500 text-sm"
        >
          <p>🎯 Sistem Undian Digital • Transparan, Adil, dan Seru!</p>
        </motion.footer>
      </div>
      <div className={"w-full p-4" + " " + (showScreen ? "" : "hidden")}>
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <div className="flex items-center justify-between gap-2 mb-6">
            <div>
              <Trophy className="text-amber-500" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">
                Pengundian
              </h2>
            </div>
            <div>
              <button
                onClick={() => setShowScreen(false)}
                className="px-4 py-2 text-white rounded-lg hover:bg-indigo-300"
              >
                <Settings className="text-indigo-600" size={24} />
              </button>
            </div>
          </div>

          {/* Roda */}
          <div className="flex justify-center mb-8">
            <div className="relative w-64 h-64">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentNumber || "init"}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.2, opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center shadow-lg">
                    <span className="text-3xl font-bold text-indigo-700">
                      {currentNumber || "?"}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Tombol Spin */}
          <div className="text-center mb-8">
            <button
              onClick={spinWheel}
              disabled={isSpinning || selectedNumbers.length === 0}
              className={`mx-auto flex items-center gap-2 py-4 px-8 rounded-xl font-bold text-white text-lg transition-all ${
                isSpinning || selectedNumbers.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              }`}
            >
              <Play size={20} />
              {isSpinning ? "Memilih..." : `Pilih ${winnersCount} Pemenang`}
            </button>
          </div>

          {/* Daftar Pemenang */}
          <div>
            <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Trophy size={18} />
              Pemenang ({winners.length}/{winnersCount})
            </h3>
            <div className="bg-amber-50 rounded-lg p-4 min-h-24">
              {winners.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Belum ada pemenang
                </p>
              ) : (
                <ul className="space-y-2">
                  {winners.map((num, idx) => (
                    <motion.li
                      key={num}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.2 }}
                      className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm"
                    >
                      <div className="bg-amber-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                        {idx + 1}
                      </div>
                      <span className="font-medium text-gray-800">
                        Nomor Undian:{" "}
                        <span className="text-amber-600 font-bold">#{num}</span>
                      </span>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default App;

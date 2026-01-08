const screen = () => {
  <div>
    <motion.div
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="bg-white rounded-2xl shadow-xl p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="text-amber-500" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">Pengundian</h2>
      </div>

      {/* Roda */}
      <div className="flex justify-center mb-8">
        <div className="relative w-64 h-64">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#818cf8"
              strokeWidth="8"
              strokeDasharray="282"
              strokeDashoffset={isSpinning ? 0 : 282}
              className={`transition-all duration-5000 ${
                isSpinning ? "animate-spin" : ""
              }`}
            />
            {/* Pointer */}
            <polygon
              points="50,10 47,20 53,20"
              fill="#ef4444"
              className="drop-shadow-md"
            />
          </svg>

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
            <p className="text-gray-500 text-center py-4">Belum ada pemenang</p>
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
  </div>;
};

export default screen;

<div className="w-screen min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4 md:p-8">
  <div>
    {/* Header */}
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
        <div className="flex items-center gap-2 mb-6">
          <Settings className="text-indigo-600" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">Konfigurasi</h2>
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
      {/* Panel Kiri: Konfigurasi & Cetak */}

      {/* Panel Kanan: Roda Undian */}
    </div>

    {/* Footer */}
    <motion.footer
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="mt-12 text-center text-gray-500 text-sm"
    >
      <p>🎯 Sistem Undian Digital • Transparan, Adil, dan Seru!</p>
    </motion.footer>
  </div>
</div>;

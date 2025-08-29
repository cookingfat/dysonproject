import React from 'react';

interface MainMenuProps {
  onStartGame: () => void;
  onOpenOptions: () => void;
  onOpenHelp: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartGame, onOpenOptions, onOpenHelp }) => {
  return (
    <>
      {/* OptionsMenu is now managed by App.tsx */}
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="text-center p-10 bg-black/40 backdrop-blur-md rounded-lg shadow-2xl glow-cyan-lg border border-cyan-500/50 clip-corner">
          <h1 className="text-6xl font-black text-cyan-300 mb-4 tracking-wider uppercase" style={{ textShadow: '0 0 10px var(--color-primary)'}}>Project Dyson</h1>
          <p className="text-lg text-gray-300 mb-8">Click your way to an industrial empire.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={onStartGame}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-10 rounded-md text-xl transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/40 clip-corner-sm"
            >
              Start Game
            </button>
            <button
              onClick={onOpenHelp}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-10 rounded-md text-xl transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/40 clip-corner-sm"
            >
              How to Play
            </button>
            <button
              onClick={onOpenOptions}
              className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-10 rounded-md text-xl transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-gray-500/40 clip-corner-sm"
            >
              Options
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainMenu;

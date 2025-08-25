import React from 'react';

interface VictoryScreenProps {
  onContinue: () => void;
  onPrestige: () => void;
}

const VictoryScreen: React.FC<VictoryScreenProps> = ({ onContinue, onPrestige }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="bg-[#0A0F1E] border-2 border-purple-500 rounded-lg shadow-2xl p-8 max-w-lg w-full text-center clip-corner glow-purple-md">
        <h1 className="text-5xl font-black text-purple-300 mb-4 tracking-wider uppercase" style={{ textShadow: '0 0 15px var(--color-accent)'}}>Victory!</h1>
        <p className="text-lg text-gray-200 mb-2">
          Congratulations, you have completed the Dyson Sphere!
        </p>
        <p className="text-gray-400 mb-8">
            Your industrial might has culminated in a marvel of stellar engineering. What will you do next?
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={onContinue}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-8 rounded-lg text-xl transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/40 clip-corner-sm"
          >
            Continue Playing
          </button>
          <button
            onClick={onPrestige}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-lg text-xl transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/40 clip-corner-sm"
          >
            Prestige Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default VictoryScreen;

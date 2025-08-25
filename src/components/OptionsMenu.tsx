import React from 'react';

interface OptionsMenuProps {
  onClose: () => void;
  volume: { master: number; music: number; sfx: number; };
  onVolumeChange: (type: 'master' | 'music' | 'sfx', value: number) => void;
}

const OptionsMenu: React.FC<OptionsMenuProps> = ({ onClose, volume, onVolumeChange }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0A0F1E] border-2 border-cyan-500 rounded-lg shadow-2xl p-8 max-w-md w-full text-center clip-corner glow-cyan-lg">
        <h2 className="text-3xl font-bold text-cyan-300 mb-6 uppercase tracking-wider">Options</h2>
        
        <div className="space-y-6 text-left">
          {/* Master Volume */}
          <div>
            <label htmlFor="master-volume" className="block mb-2 text-lg text-gray-300">Master Volume</label>
            <input 
              id="master-volume" 
              type="range" 
              min="0" 
              max="1"
              step="0.01" 
              value={volume.master}
              onChange={(e) => onVolumeChange('master', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-cyan" />
          </div>

          {/* Music Volume */}
          <div>
            <label htmlFor="music-volume" className="block mb-2 text-lg text-gray-300">Music Volume</label>
            <input 
              id="music-volume" 
              type="range" 
              min="0" 
              max="1" 
              step="0.01"
              value={volume.music}
              onChange={(e) => onVolumeChange('music', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-cyan" />
          </div>

          {/* SFX Volume */}
          <div>
            <label htmlFor="sfx-volume" className="block mb-2 text-lg text-gray-300">SFX Volume</label>
            <input 
              id="sfx-volume" 
              type="range" 
              min="0" 
              max="1" 
              step="0.01"
              value={volume.sfx}
              onChange={(e) => onVolumeChange('sfx', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-cyan" />
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-8 bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-8 rounded-lg text-xl transition-transform transform hover:scale-105 clip-corner-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default OptionsMenu;

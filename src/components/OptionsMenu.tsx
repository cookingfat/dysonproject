
import React, { useState } from 'react';

interface OptionsMenuProps {
  onClose: () => void;
  volume: { master: number; music: number; sfx: number; };
  onVolumeChange: (type: 'master' | 'music' | 'sfx', value: number) => void;
  onExport: () => void;
  onImport: (saveData: string) => void;
}

const OptionsMenu: React.FC<OptionsMenuProps> = ({ onClose, volume, onVolumeChange, onExport, onImport }) => {
  const [importValue, setImportValue] = useState('');

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0A0F1E] border-2 border-cyan-500 rounded-lg shadow-2xl p-8 max-w-md w-full text-center clip-corner glow-cyan-lg max-h-[90vh] flex flex-col">
        <h2 className="text-3xl font-bold text-cyan-300 mb-6 uppercase tracking-wider flex-shrink-0">Options</h2>
        
        <div className="overflow-y-auto pr-2 space-y-6 text-left">
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

          {/* Save Management */}
          <div className="mt-6 pt-6 border-t border-cyan-700/50">
            <h3 className="text-lg text-gray-300 mb-3">Save Management</h3>
            <div className="flex flex-col gap-3">
                <button
                    onClick={onExport}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-md transition-colors clip-corner-sm"
                >
                    Export Save to File
                </button>
                <div className="mt-2">
                    <label htmlFor="import-save" className="block mb-2 text-gray-400">Import from File</label>
                    <textarea
                        id="import-save"
                        value={importValue}
                        onChange={(e) => setImportValue(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-sm font-mono focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                        placeholder="Paste your save data here..."
                        rows={3}
                        aria-label="Paste save data"
                    />
                    <button
                        onClick={() => {
                            if (window.confirm("This will overwrite your current progress and reload the game. Are you sure?")) {
                                onImport(importValue);
                            }
                        }}
                        disabled={!importValue.trim()}
                        className="mt-2 w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed clip-corner-sm"
                    >
                        Import and Reload
                    </button>
                </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-8 flex-shrink-0 bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-8 rounded-lg text-xl transition-transform transform hover:scale-105 clip-corner-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default OptionsMenu;

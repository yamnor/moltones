'use client';

import { useState } from 'react';
import MoleculeSelector from '../components/MoleculeSelector';
import ModeControls from '../components/ModeControls';
import WaveformDisplay from '../components/WaveformDisplay';
import Help from '../components/Help';
import { MoleculeData, moleculeData } from '../data/moleculeData';
import useAudio from '../hooks/useAudio';

export default function Home() {
  const [selectedMolecule, setSelectedMolecule] = useState<keyof MoleculeData | ''>('');
  const [useIntensities, setUseIntensities] = useState(false);
  const [intensityType, setIntensityType] = useState<'ir' | 'raman'>('ir');
  const [showHelp, setShowHelp] = useState(false);
  const { toggleMode, isPlaying, getWaveformData, updateAmplitudes } = useAudio(
    selectedMolecule ? moleculeData[selectedMolecule] : null
  );

  const handleIntensityToggle = () => {
    setUseIntensities(!useIntensities);
    if (selectedMolecule) {
      const amplitudes = useIntensities
        ? new Array(moleculeData[selectedMolecule].modes.length).fill(1)
        : moleculeData[selectedMolecule].modes.map(mode => 
            intensityType === 'ir' ? mode.irIntensity : mode.ramanIntensity
          );
      updateAmplitudes(amplitudes);
    }
  };

  const handleIntensityTypeChange = (type: 'ir' | 'raman') => {
    setIntensityType(type);
    if (useIntensities && selectedMolecule) {
      const amplitudes = moleculeData[selectedMolecule].modes.map(mode => 
        type === 'ir' ? mode.irIntensity : mode.ramanIntensity
      );
      updateAmplitudes(amplitudes);
    }
  };

  return (
    <div className="min-h-screen p-2 flex flex-col justify-center items-center bg-slate-100 relative">
      {/* ヘルプボタン */}
      <button
        onClick={() => setShowHelp(true)}
        className="fixed top-4 right-4 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-md"
        aria-label="ヘルプ"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
        </svg>
      </button>

      <main className="py-20 flex flex-col justify-center items-center max-w-4xl w-full">
        <h1 className="mb-8 text-4xl font-bold text-center text-slate-800">
          分子の音 🎶
        </h1>

        <MoleculeSelector
          selectedMolecule={selectedMolecule}
          onSelectMolecule={setSelectedMolecule}
        />

        {selectedMolecule && (
          <>
            <ModeControls 
              molecule={moleculeData[selectedMolecule]} 
              toggleMode={toggleMode}
              isPlaying={isPlaying}
            />
            <div className="w-full mt-4 flex items-center justify-center space-x-4">
              <button
                onClick={handleIntensityToggle}
                className={`px-4 py-2 rounded-md ${
                  useIntensities ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                }`}
              >
                強度調整 {useIntensities ? 'オン' : 'オフ'}
              </button>
              {useIntensities && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleIntensityTypeChange('ir')}
                    className={`px-4 py-2 rounded-md ${
                      intensityType === 'ir' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    IR
                  </button>
                  <button
                    onClick={() => handleIntensityTypeChange('raman')}
                    className={`px-4 py-2 rounded-md ${
                      intensityType === 'raman' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    ラマン
                  </button>
                </div>
              )}
            </div>
            <WaveformDisplay 
              molecule={moleculeData[selectedMolecule]}
              getWaveformData={getWaveformData}
              isPlaying={isPlaying}
              useIntensities={useIntensities}
              intensityType={intensityType}
            />
          </>
        )}
      </main>
      {showHelp && <Help onClose={() => setShowHelp(false)} />}
    </div>
  );
}
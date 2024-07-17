'use client';

import { useState } from 'react';
import MoleculeSelector from '../components/MoleculeSelector';
import ModeControls from '../components/ModeControls';
import WaveformDisplay from '../components/WaveformDisplay';
import { MoleculeData, moleculeData } from '../data/moleculeData';
import useAudio from '../hooks/useAudio';
import { Analytics } from "@vercel/analytics/react"

const MAX_FRAME_RATE = 60;

export default function Home() {
  const [selectedMolecule, setSelectedMolecule] = useState<keyof MoleculeData | ''>('');
  const [frameRate, setFrameRate] = useState(MAX_FRAME_RATE);
  const { toggleMode, isPlaying, getWaveformData } = useAudio(
    selectedMolecule ? moleculeData[selectedMolecule] : null
  );

  const handleFrameRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setFrameRate(MAX_FRAME_RATE - newValue);
  };

  return (
    <div className="min-h-screen p-2 flex flex-col justify-center items-center bg-slate-100">
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
            <WaveformDisplay 
              molecule={moleculeData[selectedMolecule]}
              getWaveformData={getWaveformData}
              isPlaying={isPlaying}
              frameRate={frameRate}
            />
            <div className="w-full mt-4 flex items-center justify-center">
              <label htmlFor="frameRate" className="mr-2 text-sm font-medium text-slate-700">
                描画の速さ: {frameRate.toFixed(1)} FPS
              </label>
              <input
                id="frameRate"
                type="range"
                min="0"
                max={MAX_FRAME_RATE - 1}
                value={MAX_FRAME_RATE - frameRate}
                onChange={handleFrameRateChange}
                className="w-64"
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
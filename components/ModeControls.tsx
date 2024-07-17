import React from 'react';
import { Molecule } from '../data/moleculeData';

interface ModeControlsProps {
  molecule: Molecule;
  toggleMode: (index: number) => void;
  isPlaying: boolean[];
}

const ModeControls: React.FC<ModeControlsProps> = ({ molecule, toggleMode, isPlaying }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mt-8">
      {molecule.modes.map((mode, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-md flex flex-col">
          <div className="flex items-center mb-2">
            <span 
              className="w-5 h-5 rounded-full mr-2" 
              style={{ backgroundColor: molecule.colors[index] }}
            ></span>
            <span className="text-sm font-medium">
              {mode.name} ({mode.frequency} cm<sup>-1</sup>)
            </span>
          </div>
          <button 
            onClick={() => toggleMode(index)}
            className={`mt-2 px-4 py-2 rounded-md transition-colors ${
              isPlaying[index] 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isPlaying[index] ? '停止' : '再生'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default ModeControls;
import React from 'react';
import { MoleculeData, moleculeData } from '../data/moleculeData';

interface MoleculeSelectorProps {
  selectedMolecule: keyof MoleculeData | '';
  onSelectMolecule: (molecule: keyof MoleculeData | '') => void;
}

const MoleculeSelector: React.FC<MoleculeSelectorProps> = ({
  selectedMolecule,
  onSelectMolecule,
}) => {
  return (
    <select
      className="text-lg p-2 mb-4 border border-blue-500 rounded-md bg-white text-gray-800"
      value={selectedMolecule}
      onChange={(e) => onSelectMolecule(e.target.value as keyof MoleculeData | '')}
    >
      <option value="">分子を選んでください</option>
      {Object.entries(moleculeData).map(([key, value]) => (
        <option key={key} value={key}>
          {value.name} ({key})
        </option>
      ))}
    </select>
  );
};

export default MoleculeSelector;
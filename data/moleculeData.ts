export interface Molecule {
  name: string;
  frequencies: number[];
  modeNames: string[];
  colors: string[];
}

export interface MoleculeData {
  [key: string]: Molecule;
}

export const moleculeData: MoleculeData = {
  H2: {
    name: "水素",
    frequencies: [4401],
    modeNames: ["伸縮振動"],
    colors: ['#e74c3c']
  },
  N2: {
    name: "窒素",
    frequencies: [2359],
    modeNames: ["伸縮振動"],
    colors: ['#e74c3c']
  },
  O2: {
    name: "酸素",
    frequencies: [1580],
    modeNames: ["伸縮振動"],
    colors: ['#e74c3c']
  },
  H2O: {
    name: "水",
    frequencies: [1595, 3657, 3756],
    modeNames: ["変角振動", "対称伸縮振動", "逆対称伸縮振動"],
    colors: ['#e74c3c', '#2ecc71', '#3498db']
  },
  CH4: {
    name: "メタン",
    frequencies: [1306, 1534, 2917, 3019],
    modeNames: ["変角振動", "変角振動", "対称伸縮振動", "逆対称伸縮振動"],
    colors: ['#e74c3c', '#2ecc71', '#3498db', '#f1c40f']
  },
  NH3: {
    name: "アンモニア",
    frequencies: [950, 1627, 3337, 3444],
    modeNames: ["傘反転振動", "変角振動", "対称伸縮振動", "逆対称伸縮振動"],
    colors: ['#e74c3c', '#2ecc71', '#3498db', '#f1c40f']
  },
  CO2: {
    name: "二酸化炭素",
    frequencies: [667, 1333, 2349],
    modeNames: ["変角振動", "対称伸縮振動", "逆対称伸縮振動"],
    colors: ['#e74c3c', '#2ecc71', '#3498db']
  }
};
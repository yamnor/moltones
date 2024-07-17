export interface VibrationalMode {
  frequency: number;
  name: string;
  irIntensity: number;
  ramanIntensity: number;
}

export interface Molecule {
  name: string;
  modes: VibrationalMode[];
  colors: string[];
}

export interface MoleculeData {
  [key: string]: Molecule;
}

export const moleculeData: MoleculeData = {
  H2: {
    name: "水素",
    modes: [
      { frequency: 4401, name: "伸縮振動", irIntensity: 0, ramanIntensity: 1.0 }
    ],
    colors: ['#e74c3c']
  },
  N2: {
    name: "窒素",
    modes: [
      { frequency: 2359, name: "伸縮振動", irIntensity: 0, ramanIntensity: 1.0 }
    ],
    colors: ['#e74c3c']
  },
  O2: {
    name: "酸素",
    modes: [
      { frequency: 1580, name: "伸縮振動", irIntensity: 0, ramanIntensity: 1.0 }
    ],
    colors: ['#e74c3c']
  },
  H2O: {
    name: "水",
    modes: [
      { frequency: 1595, name: "変角振動", irIntensity: 1.0, ramanIntensity: 0.5 },
      { frequency: 3657, name: "対称伸縮振動", irIntensity: 0.5, ramanIntensity: 1.0 },
      { frequency: 3756, name: "逆対称伸縮振動", irIntensity: 0.8, ramanIntensity: 0.2 }
    ],
    colors: ['#e74c3c', '#2ecc71', '#3498db']
  },
  CH4: {
    name: "メタン",
    modes: [
      { frequency: 1306, name: "変角振動", irIntensity: 0.8, ramanIntensity: 0.4 },
      { frequency: 1534, name: "変角振動", irIntensity: 0.7, ramanIntensity: 0.6 },
      { frequency: 2917, name: "対称伸縮振動", irIntensity: 0, ramanIntensity: 1.0 },
      { frequency: 3019, name: "逆対称伸縮振動", irIntensity: 1.0, ramanIntensity: 0.3 }
    ],
    colors: ['#e74c3c', '#2ecc71', '#3498db', '#f1c40f']
  },
  NH3: {
    name: "アンモニア",
    modes: [
      { frequency: 950, name: "傘反転振動", irIntensity: 1.0, ramanIntensity: 0.2 },
      { frequency: 1627, name: "変角振動", irIntensity: 0.7, ramanIntensity: 0.5 },
      { frequency: 3337, name: "対称伸縮振動", irIntensity: 0.3, ramanIntensity: 1.0 },
      { frequency: 3444, name: "逆対称伸縮振動", irIntensity: 0.9, ramanIntensity: 0.4 }
    ],
    colors: ['#e74c3c', '#2ecc71', '#3498db', '#f1c40f']
  },
  CO2: {
    name: "二酸化炭素",
    modes: [
      { frequency: 667, name: "変角振動", irIntensity: 1.0, ramanIntensity: 0 },
      { frequency: 1333, name: "対称伸縮振動", irIntensity: 0, ramanIntensity: 1.0 },
      { frequency: 2349, name: "逆対称伸縮振動", irIntensity: 1.0, ramanIntensity: 0 }
    ],
    colors: ['#e74c3c', '#2ecc71', '#3498db']
  },
};
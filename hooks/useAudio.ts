import { useState, useEffect, useCallback, useRef } from 'react';
import { Molecule } from '../data/moleculeData';

const useAudio = (molecule: Molecule | null) => {
  const [isPlaying, setIsPlaying] = useState<boolean[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<(OscillatorNode | null)[]>([]);
  const gainNodesRef = useRef<(GainNode | null)[]>([]);
  const analysersRef = useRef<(AnalyserNode | null)[]>([]);
  const mainAnalyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (molecule) {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      mainAnalyserRef.current = audioContextRef.current.createAnalyser();
      mainAnalyserRef.current.fftSize = 2048;
      mainAnalyserRef.current.connect(audioContextRef.current.destination);
      setIsPlaying(new Array(molecule.frequencies.length).fill(false));
      oscillatorsRef.current = new Array(molecule.frequencies.length).fill(null);
      gainNodesRef.current = new Array(molecule.frequencies.length).fill(null);
      analysersRef.current = new Array(molecule.frequencies.length).fill(null);
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [molecule]);

  const createOscillator = useCallback((freq: number, index: number) => {
    if (!audioContextRef.current || !mainAnalyserRef.current) return;

    const osc = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    const analyser = audioContextRef.current.createAnalyser();
    analyser.fftSize = 2048;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq / 10, audioContextRef.current.currentTime);
    osc.connect(gainNode);
    gainNode.connect(analyser);
    analyser.connect(mainAnalyserRef.current);

    return { osc, gainNode, analyser };
  }, []);

  const stopOscillator = useCallback((index: number) => {
    const osc = oscillatorsRef.current[index];
    const gainNode = gainNodesRef.current[index];
    const analyser = analysersRef.current[index];

    if (osc) {
      osc.stop();
      osc.disconnect();
      oscillatorsRef.current[index] = null;
    }

    if (gainNode) {
      gainNode.disconnect();
      gainNodesRef.current[index] = null;
    }

    if (analyser) {
      analyser.disconnect();
      analysersRef.current[index] = null;
    }
  }, []);

  const toggleMode = useCallback((index: number) => {
    if (!molecule) return;

    setIsPlaying(prev => {
      const newIsPlaying = [...prev];
      newIsPlaying[index] = !newIsPlaying[index];

      if (newIsPlaying[index]) {
        stopOscillator(index);
        const { osc, gainNode, analyser } = createOscillator(molecule.frequencies[index], index);
        oscillatorsRef.current[index] = osc;
        gainNodesRef.current[index] = gainNode;
        analysersRef.current[index] = analyser;
        osc.start();
      } else {
        stopOscillator(index);
      }

      return newIsPlaying;
    });
  }, [molecule, createOscillator, stopOscillator]);

  const getWaveformData = useCallback(() => {
    const mainDataArray = new Float32Array(mainAnalyserRef.current?.fftSize || 0);
    mainAnalyserRef.current?.getFloatTimeDomainData(mainDataArray);

    const individualDataArrays = analysersRef.current.map(analyser => {
      if (analyser) {
        const dataArray = new Float32Array(analyser.fftSize);
        analyser.getFloatTimeDomainData(dataArray);
        return dataArray;
      }
      return null;
    });

    return { mainDataArray, individualDataArrays };
  }, []);

  return { toggleMode, isPlaying, getWaveformData };
};

export default useAudio;
import { useState, useEffect, useCallback, useRef } from 'react';
import { Molecule } from '../data/moleculeData';

const useAudio = (molecule: Molecule | null) => {
  const [isPlaying, setIsPlaying] = useState<boolean[]>([]);
  const [amplitudes, setAmplitudes] = useState<number[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<(OscillatorNode | null)[]>([]);
  const gainNodesRef = useRef<(GainNode | null)[]>([]);
  const analysersRef = useRef<(AnalyserNode | null)[]>([]);
  const mainAnalyserRef = useRef<AnalyserNode | null>(null);

  const setupAudio = useCallback(() => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    mainAnalyserRef.current = audioContextRef.current.createAnalyser();
    mainAnalyserRef.current.fftSize = 2048;
    mainAnalyserRef.current.connect(audioContextRef.current.destination);
  }, []);

  useEffect(() => {
    if (molecule) {
      setupAudio();
      setIsPlaying(new Array(molecule.modes.length).fill(false));
      setAmplitudes(new Array(molecule.modes.length).fill(1));
      oscillatorsRef.current = new Array(molecule.modes.length).fill(null);
      gainNodesRef.current = new Array(molecule.modes.length).fill(null);
      analysersRef.current = new Array(molecule.modes.length).fill(null);
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [molecule, setupAudio]);

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

    gainNode.gain.setValueAtTime(amplitudes[index], audioContextRef.current.currentTime);

    return { osc, gainNode, analyser };
  }, [amplitudes]);

  const toggleMode = useCallback((index: number) => {
    if (!molecule) return;

    setIsPlaying(prev => {
      const newIsPlaying = [...prev];
      newIsPlaying[index] = !newIsPlaying[index];

      if (newIsPlaying[index]) {
        const { osc, gainNode, analyser } = createOscillator(molecule.modes[index].frequency, index);
        oscillatorsRef.current[index] = osc;
        gainNodesRef.current[index] = gainNode;
        analysersRef.current[index] = analyser;
        osc.start();
      } else {
        if (oscillatorsRef.current[index]) {
          oscillatorsRef.current[index]!.stop();
          oscillatorsRef.current[index]!.disconnect();
          oscillatorsRef.current[index] = null;
        }
        if (gainNodesRef.current[index]) {
          gainNodesRef.current[index]!.disconnect();
          gainNodesRef.current[index] = null;
        }
        if (analysersRef.current[index]) {
          analysersRef.current[index]!.disconnect();
          analysersRef.current[index] = null;
        }
      }

      if (newIsPlaying.every(playing => !playing)) {
        // すべてのモードが停止された場合、AudioContextを完全にリセット
        setupAudio();
      }

      return newIsPlaying;
    });
  }, [molecule, createOscillator, setupAudio]);

  const updateAmplitudes = useCallback((newAmplitudes: number[]) => {
    setAmplitudes(newAmplitudes);
    newAmplitudes.forEach((amplitude, index) => {
      const gainNode = gainNodesRef.current[index];
      if (gainNode && audioContextRef.current) {
        gainNode.gain.setValueAtTime(amplitude, audioContextRef.current.currentTime);
      }
    });
  }, []);

  const getWaveformData = useCallback(() => {
    const mainDataArray = new Float32Array(mainAnalyserRef.current?.fftSize || 0);
    mainAnalyserRef.current?.getFloatTimeDomainData(mainDataArray);
  
    const individualDataArrays = analysersRef.current.map((analyser, index) => {
      if (analyser && isPlaying[index]) {
        const dataArray = new Float32Array(analyser.fftSize);
        analyser.getFloatTimeDomainData(dataArray);
        return dataArray;
      }
      return null;
    });
  
    if (isPlaying.every(playing => !playing)) {
      return { mainDataArray: new Float32Array(mainDataArray.length), individualDataArrays: [] };
    }
  
    return { mainDataArray, individualDataArrays };
  }, [isPlaying]);

  return { toggleMode, isPlaying, getWaveformData, updateAmplitudes };
};

export default useAudio;
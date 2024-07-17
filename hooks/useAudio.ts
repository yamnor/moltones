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
  const mainGainNodeRef = useRef<GainNode | null>(null);

  const setupAudio = useCallback(() => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    mainAnalyserRef.current = audioContextRef.current.createAnalyser();
    mainAnalyserRef.current.fftSize = 2048;
    mainGainNodeRef.current = audioContextRef.current.createGain();
    mainGainNodeRef.current.connect(audioContextRef.current.destination);
    mainAnalyserRef.current.connect(mainGainNodeRef.current);
  }, []);

  const mapFrequency = useCallback((freq: number) => {
    const minFreq = 200;
    const maxFreq = 1000;
    const minWavenumber = 400;
    const maxWavenumber = 4000;

    const logFreq = Math.log(freq);
    const logMinWavenumber = Math.log(minWavenumber);
    const logMaxWavenumber = Math.log(maxWavenumber);

    const normalizedFreq = (logFreq - logMinWavenumber) / (logMaxWavenumber - logMinWavenumber);
    return minFreq * Math.pow(maxFreq / minFreq, normalizedFreq);
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
    if (!audioContextRef.current || !mainAnalyserRef.current || !mainGainNodeRef.current) return null;

    const mappedFreq = mapFrequency(freq);

    const osc = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    const analyser = audioContextRef.current.createAnalyser();
    analyser.fftSize = 2048;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(mappedFreq, audioContextRef.current.currentTime);
    osc.connect(gainNode);
    gainNode.connect(analyser);
    analyser.connect(mainGainNodeRef.current);

    gainNode.gain.setValueAtTime(amplitudes[index], audioContextRef.current.currentTime);

    return { osc, gainNode, analyser };
  }, [amplitudes, mapFrequency]);

  const toggleMode = useCallback((index: number) => {
    if (!molecule) return;

    setIsPlaying(prev => {
      const newIsPlaying = [...prev];
      newIsPlaying[index] = !newIsPlaying[index];

      // Stop all oscillators and disconnect all nodes
      oscillatorsRef.current.forEach((osc, i) => {
        if (osc) {
          osc.stop();
          osc.disconnect();
          oscillatorsRef.current[i] = null;
        }
        if (gainNodesRef.current[i]) {
          gainNodesRef.current[i]!.disconnect();
          gainNodesRef.current[i] = null;
        }
        if (analysersRef.current[i]) {
          analysersRef.current[i]!.disconnect();
          analysersRef.current[i] = null;
        }
      });

      // Recreate audio context and nodes
      setupAudio();

      // Restart oscillators for all playing modes
      newIsPlaying.forEach((isPlaying, i) => {
        if (isPlaying) {
          const result = createOscillator(molecule.modes[i].frequency, i);
          if (result) {
            const { osc, gainNode, analyser } = result;
            oscillatorsRef.current[i] = osc;
            gainNodesRef.current[i] = gainNode;
            analysersRef.current[i] = analyser;
            osc.start();
          }
        }
      });

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
      return new Float32Array(mainAnalyserRef.current?.fftSize || 0);
    });

    return { mainDataArray, individualDataArrays };
  }, [isPlaying]);

  return { toggleMode, isPlaying, getWaveformData, updateAmplitudes };
};

export default useAudio;
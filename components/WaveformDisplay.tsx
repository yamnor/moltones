import React, { useRef, useEffect, useCallback } from 'react';
import { Molecule } from '../data/moleculeData';

interface WaveformDisplayProps {
  molecule: Molecule;
  getWaveformData: () => { mainDataArray: Float32Array | null, individualDataArrays: (Float32Array | null)[] };
  isPlaying: boolean[];
  useIntensities: boolean;
  intensityType: 'ir' | 'raman';
}

const WaveformDisplay: React.FC<WaveformDisplayProps> = ({
  molecule,
  getWaveformData,
  isPlaying,
  useIntensities,
  intensityType
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  const drawWaveform = useCallback((
    ctx: CanvasRenderingContext2D,
    dataArray: Float32Array,
    color: string,
    lineWidth: number,
    amplitude: number
  ) => {
    const { width, height } = ctx.canvas;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();

    const sliceWidth = width * 1.0 / dataArray.length;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
      const v = dataArray[i] * amplitude;
      const y = (0.5 - v * 0.5) * height;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.stroke();
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { mainDataArray, individualDataArrays } = getWaveformData();

    ctx.fillStyle = '#f8fafc';  // Tailwind's slate-50
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#e2e8f0';  // Tailwind's slate-200
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = i * canvas.height / 4;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw combined waveform (background)
    if (mainDataArray && mainDataArray.some(v => v !== 0)) {
      drawWaveform(ctx, mainDataArray, 'rgba(30, 41, 59, 0.1)', 3, 1);  // Tailwind's slate-800 with low opacity
    }

    // Draw individual mode waveforms
    individualDataArrays.forEach((dataArray, index) => {
      if (isPlaying[index] && dataArray) {
        const amplitude = useIntensities
          ? intensityType === 'ir'
            ? molecule.modes[index].irIntensity
            : molecule.modes[index].ramanIntensity
          : 1;
        drawWaveform(ctx, dataArray, molecule.colors[index], 2, amplitude);
      }
    });

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [getWaveformData, isPlaying, molecule.colors, molecule.modes, drawWaveform, useIntensities, intensityType]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    }
  }, []);

  return (
    <div className="w-full h-64 mt-8 rounded-lg relative bg-slate-50 shadow-md overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default WaveformDisplay;
import React from 'react';

interface AudioWaveformProps {
  isPlaying?: boolean;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({ isPlaying = false }) => {
  return (
    <div className="flex items-center gap-[3px] h-4 px-1" title={isPlaying ? 'Reproduzindo prévia' : 'Prévia pausada'}>
      <span
        className={`w-[3px] bg-flowgreen-400 rounded-full transition-all duration-300 ${
          isPlaying ? 'h-4 animate-[pulse_0.6s_ease-in-out_infinite]' : 'h-1.5'
        }`}
      />
      <span
        className={`w-[3px] bg-flowgreen-400 rounded-full transition-all duration-300 delay-75 ${
          isPlaying ? 'h-3 animate-[pulse_0.8s_ease-in-out_infinite]' : 'h-2.5'
        }`}
      />
      <span
        className={`w-[3px] bg-flowgreen-400 rounded-full transition-all duration-300 delay-150 ${
          isPlaying ? 'h-5 animate-[pulse_0.5s_ease-in-out_infinite]' : 'h-1'
        }`}
      />
      <span
        className={`w-[3px] bg-flowgreen-400 rounded-full transition-all duration-300 delay-100 ${
          isPlaying ? 'h-2 animate-[pulse_0.7s_ease-in-out_infinite]' : 'h-2'
        }`}
      />
    </div>
  );
};

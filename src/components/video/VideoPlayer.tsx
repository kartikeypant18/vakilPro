'use client';

import { forwardRef } from 'react';

interface VideoPlayerProps {
  muted?: boolean;
  name?: string;
  variant?: 'full' | 'pip';
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(({ muted = false, name, variant = 'full' }, ref) => {
  if (variant === 'pip') {
    return (
      <div className="relative w-full h-full overflow-hidden rounded-xl bg-slate-900 ring-2 ring-white/20 shadow-2xl">
        {name && (
          <div className="absolute left-2 top-2 z-10 bg-black/60 text-white px-2 py-0.5 rounded text-xs font-medium pointer-events-none">
            {name}
          </div>
        )}
        <video
          ref={ref}
          autoPlay
          playsInline
          muted={muted}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl bg-black">
      {name && (
        <div className="absolute left-3 top-3 z-10 bg-black/60 text-white px-3 py-1 rounded-lg font-semibold text-sm pointer-events-none backdrop-blur-sm">
          {name}
        </div>
      )}
      <video
        ref={ref}
        autoPlay
        playsInline
        muted={muted}
        className="h-full w-full object-cover"
      />
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

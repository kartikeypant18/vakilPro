'use client';

import { forwardRef } from 'react';

interface VideoPlayerProps {
  muted?: boolean;
  name?: string;
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(({ muted = false, name }, ref) => {
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
      {/* Name overlay at top left */}
      {name && (
        <div className="absolute left-2 top-2 z-10 bg-black/60 text-white px-3 py-1 rounded font-semibold text-sm pointer-events-none">
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

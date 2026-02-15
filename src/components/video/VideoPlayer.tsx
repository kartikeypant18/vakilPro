'use client';

import { forwardRef } from 'react';

interface VideoPlayerProps {
  muted?: boolean;
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(({ muted = false }, ref) => {
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
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

import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

const HlsVideo = ({
  src,
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  className = '',
  poster = '',
  style = {}
}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlay) {
          video.play().catch(e => console.error("Error playing video:", e));
        }
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // For Safari or browsers with native HLS support
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        if (autoPlay) {
          video.play().catch(e => console.error("Error playing video:", e));
        }
      });
    }
  }, [src, autoPlay]);

  return (
    <video
      ref={videoRef}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      className={className}
      poster={poster}
      style={style}
    />
  );
};

export default HlsVideo;

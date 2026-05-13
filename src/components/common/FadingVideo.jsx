import React, { useEffect, useRef } from 'react';

const FADE_MS = 500;
const FADE_OUT_LEAD = 0.55;

const FadingVideo = ({ src, className, style }) => {
  const videoRef = useRef(null);
  const rafId = useRef(null);
  const fadingOutRef = useRef(false);

  const fadeTo = (targetOpacity, duration) => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    
    const startOpacity = parseFloat(videoRef.current.style.opacity) || 0;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentOpacity = startOpacity + (targetOpacity - startOpacity) * progress;
      
      if (videoRef.current) {
        videoRef.current.style.opacity = currentOpacity;
      }

      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      }
    };

    rafId.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      video.style.opacity = '0';
      video.play().catch(error => {
        if (error.name !== 'AbortError') {
          console.error("Error playing video:", error);
        }
      });
      fadeTo(1, FADE_MS);
    };

    const handleTimeUpdate = () => {
      if (!fadingOutRef.current) {
        const remaining = video.duration - video.currentTime;
        if (remaining <= FADE_OUT_LEAD && remaining > 0) {
          fadingOutRef.current = true;
          fadeTo(0, FADE_MS);
        }
      }
    };

    const handleEnded = () => {
      video.style.opacity = '0';
      setTimeout(() => {
        if (video) {
          video.currentTime = 0;
          video.play().catch(error => {
            if (error.name !== 'AbortError') {
              console.error("Error playing video:", error);
            }
          });
          fadingOutRef.current = false;
          fadeTo(1, FADE_MS);
        }
      }, 100);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      style={{ ...style, opacity: 0 }}
      autoPlay
      muted
      playsInline
      preload="auto"
    />
  );
};

export default FadingVideo;

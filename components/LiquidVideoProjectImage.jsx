import { useMemo, useRef, useState } from 'react';

const LiquidVideoProjectImage = ({
  src,
  alt = 'Project Image',
  liquidVideo,
  className = '',
}) => {
  const videoRef = useRef(null);
  const [videoReady, setVideoReady] = useState(Boolean(liquidVideo));
  const [isHovered, setIsHovered] = useState(false);
  const isCoarsePointer = useMemo(() => (
    typeof window !== 'undefined'
      ? window.matchMedia('(hover: none), (pointer: coarse)').matches
      : false
  ), []);

  const canShowVideo = videoReady && Boolean(liquidVideo);

  const handleEnter = async () => {
    if (isCoarsePointer) return;
    setIsHovered(true);
    if (!canShowVideo || !videoRef.current) return;

    try {
      await videoRef.current.play();
    } catch {
      // Ignore autoplay/play interruptions.
    }
  };

  const handleLeave = () => {
    if (isCoarsePointer) return;
    setIsHovered(false);
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  };

  return (
    <div
      className={`project-media ${className}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      onTouchStart={() => {
        if (!isCoarsePointer || !videoRef.current) return;
        if (videoRef.current.paused) {
          setIsHovered(true);
          videoRef.current.play().catch(() => {});
          return;
        }
        setIsHovered(false);
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }}
    >
      <img
        className={`project-image ${isHovered && canShowVideo ? 'project-image--zoom' : ''}`}
        src={src}
        alt={alt}
        loading="lazy"
      />
      {liquidVideo && (
        <video
          ref={videoRef}
          className={`liquid-hover-video ${isHovered && canShowVideo ? 'liquid-hover-video--active' : ''}`}
          src={liquidVideo}
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setVideoReady(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default LiquidVideoProjectImage;

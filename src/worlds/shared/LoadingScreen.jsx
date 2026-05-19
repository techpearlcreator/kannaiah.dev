import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const completeRef = useRef(false);

  useEffect(() => {
    const finishLoading = () => {
      if (completeRef.current) return;
      completeRef.current = true;
      onComplete();
    };

    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', delay: 0.15 },
    );

    const progressTimeline = gsap.timeline({
      onUpdate: () => {
        setProgress(Math.round(progressTimeline.progress() * 100));
      },
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          y: -18,
          scale: 1.02,
          duration: 0.8,
          ease: 'expo.inOut',
          onComplete: finishLoading,
        });
      },
    });

    progressTimeline.to({}, { duration: 2.8 });

    const safetyTimeout = setTimeout(finishLoading, 4500);

    return () => {
      progressTimeline.kill();
      clearTimeout(safetyTimeout);
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="loader-container fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#fdfaf5] px-6 text-[#151515]"
    >
      <div ref={contentRef} className="w-full max-w-sm text-center">
        <p className="mb-3 text-sm font-medium text-black/45">Welcome to my portfolio</p>
        <h1 className="text-2xl font-semibold tracking-normal text-black md:text-3xl">
          Loading experience
        </h1>
        <p className="mt-3 text-sm leading-6 text-black/45">
          Preparing the first view.
        </p>

        <div className="mt-8 h-px w-full overflow-hidden bg-black/10">
          <div
            className="h-full bg-black transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-black/35">
          <span>Loading</span>
          <span>{progress.toString().padStart(3, '0')}%</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

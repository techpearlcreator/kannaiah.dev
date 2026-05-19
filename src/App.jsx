import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import LoadingScreen from './worlds/shared/LoadingScreen';
import FrontendWorld from './worlds/frontend/FrontendWorld';

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [error, setError] = useState(null);
  const mainContainerRef = useRef(null);
  const lenisRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    console.log('App mounted');
  }, []);

  useEffect(() => {
    const handleError = (e) => {
      if (e.message?.includes('WebGL') || e.message?.includes('texImage3D')) return;
      setError(e.message);
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    function raf(time) {
      if (lenisRef.current) {
        lenisRef.current.raf(time);
        rafRef.current = requestAnimationFrame(raf);
      }
    }
    rafRef.current = requestAnimationFrame(raf);

    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const targetId = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80, duration: 1.5 });
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (lenisRef.current) lenisRef.current.destroy();
      lenisRef.current = null;
      document.removeEventListener('click', handleAnchorClick);
    };
  }, [isLoading]);

  const handleLoadingComplete = () => {
    console.log('Loader finished. Switching to portfolio.');
    setIsLoading(false);
    setShowPortfolio(true);
  };

  useLayoutEffect(() => {
    if (!showPortfolio || !mainContainerRef.current) return;

    try {
      gsap.set(mainContainerRef.current, { opacity: 0, y: 30 });
      gsap.fromTo(
        mainContainerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'expo.out',
          clearProps: 'opacity,transform',
          onComplete: () => {
            setTimeout(() => {
              ScrollTrigger.refresh();
            }, 100);
          },
        },
      );
    } catch (err) {
      console.error('GSAP error:', err);
      mainContainerRef.current.style.opacity = 1;
      mainContainerRef.current.style.transform = 'translateY(0)';
    }
  }, [showPortfolio]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#030308] text-red-500 flex flex-col items-center justify-center p-10 text-center font-mono">
        <h1 className="text-2xl mb-4 font-black tracking-tighter uppercase">System Error</h1>
        <p className="opacity-40 text-xs mb-10 max-w-xl leading-relaxed">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-10 py-4 border border-red-500/30 rounded-full hover:bg-red-500/10 transition-all text-[10px] font-bold tracking-widest uppercase"
        >
          Reload Portfolio
        </button>
      </div>
    );
  }

  class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(err) {
      return { hasError: true, error: err };
    }

    componentDidCatch(err, errorInfo) {
      console.error('ErrorBoundary caught an error', err, errorInfo);
      this.setState({ errorInfo });
    }

    render() {
      if (this.state.hasError) {
        return (
          <div style={{ padding: '20px', background: '#ffcccc', color: 'red', minHeight: '100vh', zIndex: 99999 }}>
            <h1>React Render Crash!</h1>
            <h2>{this.state.error?.toString()}</h2>
            <pre>{this.state.errorInfo?.componentStack}</pre>
          </div>
        );
      }
      return this.props.children;
    }
  }

  return (
    <div className="relative w-full min-h-screen bg-[#fdfaf5] z-0 overflow-x-hidden">
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      {showPortfolio && (
        <div
          ref={mainContainerRef}
          className="relative w-full z-10"
          style={{ opacity: 0, visibility: 'visible', position: 'relative', zIndex: 1 }}
        >
          <ErrorBoundary>
            <FrontendWorld />
          </ErrorBoundary>
        </div>
      )}
    </div>
  );
};

export default App;

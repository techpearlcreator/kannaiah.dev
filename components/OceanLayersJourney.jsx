import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * OCEAN LAYERS JOURNEY (FIXED V3)
 * ──────────────────────────────────────────────────────────────
 * Fixed Pinning, Z-Index, and Visibility Logic.
 */

const stages = [
  {
    id: 1,
    title: "Shore of Curiosity",
    body: "Started learning HTML, CSS, JavaScript, and responsive web fundamentals.",
    meaning: "The beginning of an obsession.",
    depth: "0m",
    color: "#E2DBF8",
    creature: "fish-small"
  },
  {
    id: 2,
    title: "Creative Ocean",
    body: "Exploring UI/UX, frontend creativity, interactive experiences, and modern web design.",
    meaning: "Where frontend becomes art.",
    depth: "400m",
    color: "#10375C",
    creature: "fish-school"
  },
  {
    id: 3,
    title: "Motion Depths",
    body: "Building cinematic web experiences using GSAP, motion design, Three.js, and AI workflows.",
    meaning: "Physics and motion define the experience.",
    depth: "1200m",
    color: "#0A0A2A",
    creature: "jellyfish"
  },
  {
    id: 4,
    title: "System Depths",
    body: "Learning APIs, databases, backend logic, debugging, and system architecture.",
    meaning: "The engine beneath the beauty.",
    depth: "2800m",
    color: "#020205",
    creature: "whale"
  },
  {
    id: 5,
    title: "AI Abyss",
    body: "Exploring AI tools, intelligent systems, automation, and future-focused development.",
    meaning: "The horizon of digital intelligence.",
    depth: "5000m",
    color: "#000000",
    creature: "neural-signals"
  },
  {
    id: 6,
    title: "Discovery Core",
    body: "Still exploring deeper worlds.",
    meaning: "Evolution is a continuous dive.",
    depth: "8000m",
    color: "#050510",
    creature: "civilization"
  }
];

const OceanLayersJourney = () => {
  const containerRef = useRef(null);
  const pinRef = useRef(null);
  const [activeStage, setActiveStage] = useState(0);
  const [progress, setProgress] = useState(0);

  const activeStageRef = useRef(0);

  useEffect(() => {
    // 1. Surgical ScrollTrigger Setup - Stable & Persistent
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        pin: pinRef.current,
        start: "top top",
        end: `+=${stages.length * 150}%`, // Extended scroll for better pacing
        scrub: 1,
        onUpdate: (self) => {
          const rawProgress = self.progress;
          setProgress(rawProgress);
          
          const stage = Math.min(
            Math.floor(rawProgress * stages.length),
            stages.length - 1
          );
          
          if (stage !== activeStageRef.current) {
            console.log(`[OceanJourney] Stage Transition: ${activeStageRef.current} -> ${stage}`);
            activeStageRef.current = stage;
            setActiveStage(stage); // Update state for UI reactivity
          }
        },
      });

      // Crucial: Refresh to ensure pinning height is calculated
      ScrollTrigger.refresh();
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []); // Empty dependency array: Create once, stay alive.

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-screen bg-black overflow-visible"
      id="ocean-journey-trigger"
    >
      {/* ── The Pinned Wrapper ────────────────────────────────────────── */}
      <div 
        ref={pinRef} 
        className="relative w-full h-screen overflow-hidden bg-black"
        style={{ position: 'relative' }} 
      >
        
        {/* Ocean Background Layers (z-index: 0) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
           <OceanBackground progress={progress} activeStage={activeStage} />
        </div>

        {/* Global Telemetry HUD (z-index: 40) */}
        <TelemetryHUD progress={progress} />

        {/* The Timeline Content Panels (z-index: 50) */}
        <div className="relative z-50 h-full w-full pointer-events-none">
           {stages.map((stage, i) => (
             <ResearchPanel 
               key={stage.id} 
               stage={stage} 
               index={i} 
               progress={progress} 
             />
           ))}
        </div>

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 pointer-events-none z-[60] shadow-[inset_0_0_200px_rgba(0,0,0,1)]" />
      </div>
    </section>
  );
};

// ─── Component: The Parallax Ocean Layers ───────────────────────────────────
const OceanBackground = ({ progress, activeStage }) => {
  // Interpolate background color manually for more control
  const currentStage = stages[activeStage];
  
  return (
    <div 
      className="absolute inset-0 transition-colors duration-1000 ease-in-out"
      style={{ backgroundColor: currentStage.color }}
    >
      {/* Bubbles / Particles Layer */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i} 
            className="absolute rounded-full bg-white/10 blur-[1px] animate-float-slow" 
            style={{ 
              width: Math.random() * 6 + 2, 
              height: Math.random() * 6 + 2,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.1 + Math.random() * 0.2,
              transform: `translateY(${progress * -1000}px)` // Manual parallax
            }} 
          />
        ))}
      </div>

      {/* Surface Waves (Visible at top only) */}
      {activeStage === 0 && (
         <div className="absolute top-0 w-full opacity-20">
            <svg viewBox="0 0 1440 320" className="w-full">
               <path fill="white" d="M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,112C672,107,768,149,864,165.3C960,181,1056,171,1152,144C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
         </div>
      )}
    </div>
  );
};

// ─── Component: The Timeline Panel (Glassmorphism Research Station) ────────
const ResearchPanel = ({ stage, index, progress }) => {
  const start = index / stages.length;
  const end = (index + 1) / stages.length;
  
  // Calculate visibility threshold
  const isActive = progress >= start && progress < end;
  
  // Opacity & Y mapping
  // We use a safe range to avoid "disappearing" mid-scroll
  const range = end - start;
  const stageProgress = (progress - start) / range;
  
  const opacity = stageProgress < 0.1 ? stageProgress * 10 : stageProgress > 0.9 ? (1 - stageProgress) * 10 : 1;
  const y = (1 - opacity) * 50;

  return (
    <div 
      className={`absolute inset-0 flex items-center justify-center p-6 md:p-20 transition-all duration-700 ${isActive ? 'visible opacity-100' : 'invisible opacity-0'}`}
      style={{ 
        opacity: Math.max(0, Math.min(1, opacity)),
        transform: `translateY(${y}px)`
      }}
    >
      <div className="relative max-w-2xl w-full pointer-events-auto">
        <div className="relative p-10 md:p-16 rounded-[2.5rem] border border-white/10 bg-white/[0.04] backdrop-blur-3xl shadow-2xl overflow-hidden">
          
          {/* Internal Metadata */}
          <div className="absolute top-8 left-10 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#7B61FF] shadow-[0_0_10px_#7B61FF]" />
            <span className="text-[9px] font-mono text-[#7B61FF] tracking-[0.4em] uppercase font-bold">Node_Active</span>
          </div>
          
          <div className="absolute top-8 right-10 text-[9px] font-mono text-white/20 uppercase tracking-widest">
             {stage.depth} // DEPLOY_0{index + 1}
          </div>

          <div className="mt-8">
            <p className="text-[10px] tracking-[0.8em] font-black text-white/40 uppercase mb-8">
              Phase 0{index + 1}
            </p>
            
            <h3 className="text-4xl md:text-7xl font-sans font-black italic tracking-tighter text-white mb-8 leading-none">
               {stage.title}
            </h3>
            
            <p className="text-base md:text-xl font-light text-white/60 leading-relaxed mb-12 max-w-lg border-l-2 border-[#7B61FF]/30 pl-8">
              {stage.body}
            </p>

            <div className="flex items-center gap-6 pt-10 border-t border-white/5">
               <div className="flex flex-col">
                  <span className="text-[8px] font-mono text-white/20 uppercase mb-2 tracking-[0.2em]">Core Observation</span>
                  <span className="text-xs md:text-sm tracking-widest uppercase text-[#7B61FF] font-black italic">
                    {stage.meaning}
                  </span>
               </div>
            </div>
          </div>

          {/* Silhouette Creature Decoration */}
          <div className="absolute -bottom-10 -right-10 opacity-10 blur-sm pointer-events-none scale-150 rotate-12">
            <StageCreature type={stage.creature} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Component: Sea Life Silhouettes ────────────────────────────────────────
const StageCreature = ({ type }) => {
  if (type === 'fish-small') return (
    <svg width="100" height="60" viewBox="0 0 60 40" fill="white">
      <path d="M50,20 C50,30 40,40 20,40 C10,40 0,30 0,20 C0,10 10,0 20,0 C40,0 50,10 50,20 Z" />
      <path d="M50,20 L60,10 L60,30 Z" />
    </svg>
  );
  if (type === 'jellyfish') return (
    <svg width="120" height="180" viewBox="0 0 100 150" fill="white">
      <path d="M10,50 C10,20 90,20 90,50 L90,60 L10,60 Z" />
      <path d="M20,60 V120 M40,60 V140 M60,60 V140 M80,60 V120" stroke="white" strokeWidth="2" />
    </svg>
  );
  if (type === 'whale') return (
    <svg width="400" height="150" viewBox="0 0 300 100" fill="white">
      <path d="M0,50 C50,20 150,20 250,50 C280,60 300,80 300,80 L280,90 C250,80 150,80 50,90 Z" />
      <path d="M250,50 L280,30 L280,70 Z" />
    </svg>
  );
  return null;
};

// ─── Component: Global Telemetry HUD ─────────────────────────────────────────
const TelemetryHUD = ({ progress }) => {
  const depth = Math.round(progress * 8000);
  
  return (
    <div className="absolute top-1/2 left-10 md:left-20 -translate-y-1/2 z-[100] flex flex-col items-start gap-6 pointer-events-none">
       <div className="flex flex-col gap-1">
          <span className="text-[9px] font-mono text-[#7B61FF] uppercase tracking-[0.5em] font-bold">Depth Telemetry</span>
          <span className="text-4xl md:text-6xl font-sans font-black text-white/90 tabular-nums tracking-tighter">
             {depth}m
          </span>
       </div>
       <div className="w-[2px] h-32 bg-white/10 relative overflow-hidden rounded-full">
          <div 
            style={{ height: `${progress * 100}%` }}
            className="w-full bg-gradient-to-b from-[#7B61FF] to-[#c864ff] transition-all duration-300" 
          />
       </div>
    </div>
  );
};

export default OceanLayersJourney;

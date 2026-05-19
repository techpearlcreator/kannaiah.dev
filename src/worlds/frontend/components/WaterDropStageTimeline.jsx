import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * WATER DROP STAGE TIMELINE
 * ──────────────────────────────────────────────────────────────
 * A premium stage-based timeline where each scroll triggers a 
 * cinematic water-drop impact reveal.
 */

const stages = [
  {
    id: 1,
    title: "Foundation Layer",
    body: "Started learning HTML, CSS, JavaScript, and responsive web design fundamentals.",
    color: "#30E3CA", // Cyan
  },
  {
    id: 2,
    title: "Creative Frontend Layer",
    body: "Exploring UI/UX, frontend creativity, interactive interfaces, and modern web design.",
    color: "#7B61FF", // Purple
  },
  {
    id: 3,
    title: "Vibe Code Developer Layer",
    body: "Building cinematic web experiences using motion design, GSAP, Three.js, and AI-assisted workflows.",
    color: "#c864ff", // Lilac
  },
  {
    id: 4,
    title: "Backend Learning Layer",
    body: "Learning APIs, databases, authentication, debugging, and backend system flow.",
    color: "#4d79ff", // Blue
  },
  {
    id: 5,
    title: "AI Engineering Exploration",
    body: "Exploring AI tools, intelligent systems, automation, and future-focused product development.",
    color: "#ff00ff", // Pink
  },
  {
    id: 6,
    title: "Industry-Ready Direction",
    body: "Improving practical skills, solving real problems, and preparing for real-world industry challenges.",
    color: "#ffffff", // White
  }
];

const WaterDropStageTimeline = () => {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const dropRef = useRef(null);
  const rippleRef = useRef(null);
  const overlayRef = useRef(null);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const drop = dropRef.current;
    const ripple = rippleRef.current;
    const overlay = overlayRef.current;

    // 1. Core ScrollTrigger for Pinning & Stage Management
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        pin: pin,
        start: "top top",
        end: `+=${stages.length * 100}%`,
        scrub: 1,
        snap: 1 / (stages.length - 1),
        onUpdate: (self) => {
          const stage = Math.round(self.progress * (stages.length - 1));
          if (stage !== activeStage) {
            triggerTransition(stage);
          }
        }
      }
    });

    // 2. The "Water Drop" Transition Sequence
    const triggerTransition = (nextStage) => {
      const stageColor = stages[nextStage].color;
      
      const transitionTl = gsap.timeline({
        onStart: () => {
          // Prepare next stage content (opacity handled by React or GSAP)
        }
      });

      // A. Drop Falls
      transitionTl.fromTo(drop, 
        { y: -500, opacity: 0, scaleY: 2 },
        { y: 0, opacity: 1, scaleY: 1, duration: 0.4, ease: "power2.in" }
      );

      // B. Impact & Ripple
      transitionTl.set(drop, { opacity: 0 });
      transitionTl.fromTo(ripple,
        { scale: 0, opacity: 1 },
        { scale: 4, opacity: 0, duration: 1, ease: "power2.out" },
        "impact"
      );

      // C. Liquid Messy Distortion
      transitionTl.fromTo(overlay,
        { backdropFilter: "blur(0px) contrast(100%)", opacity: 0 },
        { 
          backdropFilter: "blur(30px) contrast(150%)", 
          opacity: 1, 
          duration: 0.3, 
          ease: "none",
          onComplete: () => setActiveStage(nextStage) // Switch stage at peak distortion
        },
        "impact"
      );

      // D. Clear & Reveal
      transitionTl.to(overlay, { 
        backdropFilter: "blur(0px) contrast(100%)", 
        opacity: 0, 
        duration: 0.6, 
        ease: "power2.out" 
      });
    };

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [activeStage]);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full bg-[#020205] overflow-visible"
      id="water-drop-timeline"
    >
      <div 
        ref={pinRef} 
        className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      >
        {/* ── Background Atmosphere ─────────────────────────────────────── */}
        <div className="absolute inset-0 z-0">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(123,97,255,0.05)_0%,transparent_70%)]" />
           <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-[#020205] to-transparent opacity-60" />
        </div>

        {/* ── Water Drop Transition Elements (z-index: 50) ─────────────── */}
        <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
           {/* Falling Drop */}
           <div ref={dropRef} className="w-4 h-8 bg-gradient-to-b from-white/80 to-cyan-400/80 rounded-full blur-[1px] opacity-0" />
           
           {/* Ripple Rings */}
           <div ref={rippleRef} className="absolute w-40 h-40 border border-cyan-400/40 rounded-full opacity-0" />
           
           {/* Liquid Distortion Overlay */}
           <div ref={overlayRef} className="absolute inset-0 bg-white/[0.02] opacity-0" />
        </div>

        {/* ── Stage Content (z-index: 20) ─────────────────────────────── */}
        <div className="relative z-20 w-full max-w-4xl px-6">
           <AnimateStage stage={stages[activeStage]} activeIndex={activeStage} />
        </div>

        {/* ── Progress HUD ────────────────────────────────────────────── */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 z-30 opacity-40">
           {stages.map((_, i) => (
             <div 
               key={i} 
               className={`w-2 h-2 rounded-full transition-all duration-500 ${activeStage === i ? 'bg-cyan-400 scale-150 shadow-[0_0_10px_#00ffff]' : 'bg-white/20'}`} 
             />
           ))}
        </div>

        {/* Stage Counter */}
        <div className="absolute top-12 right-12 font-mono text-white/20 text-4xl z-30">
           0{activeStage + 1} <span className="text-sm opacity-50">/ 06</span>
        </div>
      </div>
    </section>
  );
};

// ─── Component: Stage Content Card ──────────────────────────────────────────
const AnimateStage = ({ stage, activeIndex }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    gsap.fromTo(card.querySelectorAll('.stagger-text'),
      { opacity: 0, y: 30, filter: "blur(10px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, stagger: 0.1, ease: "power2.out" }
    );
  }, [stage]);

  return (
    <div 
      ref={cardRef}
      className="relative p-10 md:p-20 rounded-[3rem] border border-white/10 bg-white/[0.02] backdrop-blur-3xl shadow-2xl overflow-hidden group"
    >
      {/* Water Reflection Overlay */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
         <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-reflection" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <p className="text-[10px] tracking-[0.8em] font-black text-cyan-400 uppercase mb-8 stagger-text">
           Stage 0{activeIndex + 1}
        </p>
        
        <h3 className="text-4xl md:text-7xl font-sans font-black italic tracking-tighter text-white mb-8 leading-none stagger-text">
           {stage.title}
        </h3>
        
        <p className="text-lg md:text-2xl font-light text-white/50 leading-relaxed max-w-2xl stagger-text">
           {stage.body}
        </p>

        <div className="mt-12 w-20 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent stagger-text" />
      </div>

      <style jsx>{`
        @keyframes reflection {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        .animate-reflection {
          animation: reflection 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default WaterDropStageTimeline;

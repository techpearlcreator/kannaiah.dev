import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * BlueprintConstructionTimeline
 * ──────────────────────────────────────────────────────────────
 * A premium, futuristic engineering-themed timeline.
 * Features:
 * - Dynamic SVG blueprint drawing
 * - Layered construction animations
 * - Technical UI overlays (grids, coordinate lines)
 * - System assembly effects per milestone
 */

const milestones = [
  {
    id: "foundation",
    step: "01",
    title: "Foundation Layer",
    description: "Started learning HTML, CSS, JavaScript, and responsive web design fundamentals.",
    visualType: "wireframe",
    side: "left"
  },
  {
    id: "interface",
    step: "02",
    title: "Creative Interface Layer",
    description: "Built UI concepts, portfolio experiments, and interactive frontend projects.",
    visualType: "ui-panels",
    side: "right"
  },
  {
    id: "vibecode",
    step: "03",
    title: "Vibe Code Developer Layer",
    description: "Exploring cinematic UI, animations, motion design, and AI-assisted development workflows.",
    visualType: "motion-glow",
    side: "left"
  },
  {
    id: "backend",
    step: "04",
    title: "Backend Engine Layer",
    description: "Learning APIs, databases, authentication systems, debugging, and backend logic.",
    visualType: "pipelines",
    side: "right"
  },
  {
    id: "ai",
    step: "05",
    title: "AI Engineering Exploration",
    description: "Exploring intelligent systems, AI tools, and future-focused product development.",
    visualType: "neural-pulse",
    side: "left"
  },
  {
    id: "industry",
    step: "06",
    title: "Industry-Ready Direction",
    description: "Continuously improving practical skills, problem-solving ability, and real-world development thinking.",
    visualType: "system-core",
    side: "right"
  }
];

const BlueprintConstructionTimeline = () => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const cardRefs = useRef([]);
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    const container = containerRef.current;
    const path = pathRef.current;
    
    // 1. Initial State: Path is hidden
    const pathLength = path.getTotalLength();
    gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

    // 2. Animate Main Blueprint Line on Scroll
    gsap.to(path, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top 20%",
        end: "bottom 80%",
        scrub: 1.5,
      }
    });

    // 3. Milestone Activation & Module Assembly
    milestones.forEach((_, i) => {
      ScrollTrigger.create({
        trigger: cardRefs.current[i],
        start: "top 70%",
        end: "bottom 30%",
        onEnter: () => setActiveStep(i),
        onEnterBack: () => setActiveStep(i),
        onLeaveBack: () => i === 0 ? setActiveStep(-1) : setActiveStep(i - 1)
      });

      // Animate Card Entrance
      gsap.fromTo(cardRefs.current[i],
        { opacity: 0, x: i % 2 === 0 ? -100 : 100, scale: 0.9 },
        {
          opacity: 1, x: 0, scale: 1,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: cardRefs.current[i],
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-screen bg-[#05050a] py-40 overflow-hidden"
      id="blueprint-timeline"
    >
      {/* ── Background Engineering Grid ────────────────────────────────── */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `linear-gradient(#1e1e2f 1px, transparent 1px), linear-gradient(90deg, #1e1e2f 1px, transparent 1px)`,
          backgroundSize: '40px 40px' 
        }} />
        <div className="absolute inset-0" style={{ 
          backgroundImage: `linear-gradient(#1e1e2f 0.5px, transparent 0.5px), linear-gradient(90deg, #1e1e2f 0.5px, transparent 0.5px)`,
          backgroundSize: '8px 8px' 
        }} />
      </div>

      {/* ── Background Scanline Effect ─────────────────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-transparent via-[#7B61FF]/5 to-transparent h-1/4 w-full animate-scan" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-40">
          <p className="text-[10px] tracking-[0.8em] uppercase font-bold text-[#7B61FF] mb-4">
            System Architecture
          </p>
          <h2 className="text-5xl md:text-7xl font-sans font-black tracking-tighter text-white mb-6 uppercase">
            Blueprint <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7B61FF] to-[#c864ff]">Construction</span>
          </h2>
          <p className="text-white/40 text-sm md:text-lg max-w-lg mx-auto font-light tracking-wide italic">
            "Constructing myself step by step into an industry-ready developer."
          </p>
        </div>

        {/* Timeline Content */}
        <div className="relative">
          
          {/* Central Blueprint Path (SVG) */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 md:-translate-x-1/2 w-full max-w-[2px] md:max-w-none pointer-events-none h-full">
            <svg 
              ref={svgRef}
              className="w-full h-full"
              viewBox="0 0 100 1000" 
              preserveAspectRatio="none"
            >
              <path 
                ref={pathRef}
                d="M 50 0 L 50 1000" 
                stroke="#7B61FF" 
                strokeWidth="0.5" 
                fill="none" 
                strokeOpacity="0.4"
              />
              {/* Dynamic Connection Nodes */}
              {milestones.map((_, i) => (
                <circle 
                  key={i}
                  cx="50" 
                  cy={150 + i * 150} 
                  r={activeStep >= i ? "2" : "1"} 
                  fill={activeStep >= i ? "#7B61FF" : "white"} 
                  className="transition-all duration-500"
                />
              ))}
            </svg>
          </div>

          {/* Milestone Blocks */}
          <div className="flex flex-col gap-32 md:gap-40">
            {milestones.map((m, i) => (
              <div 
                key={i}
                ref={el => cardRefs.current[i] = el}
                className={`relative flex items-center w-full pl-16 md:pl-0 ${m.side === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Milestone Info Card */}
                <div className={`w-full md:w-[42%] group ${m.side === 'left' ? 'md:mr-auto' : 'md:ml-auto'}`}>
                  <div className={`
                    relative p-8 md:p-10 rounded-2xl border transition-all duration-700 overflow-hidden
                    ${activeStep === i 
                      ? 'bg-[#7B61FF]/5 border-[#7B61FF]/40 shadow-[0_0_50px_rgba(123,97,255,0.1)]' 
                      : 'bg-white/[0.02] border-white/10 opacity-40 hover:opacity-100'}
                  `}>
                    {/* Technical HUD Details */}
                    <div className="absolute top-4 right-4 text-[8px] font-mono text-white/20 tracking-tighter">
                      ID: {m.id.toUpperCase()} // MODULE_{m.step}
                    </div>
                    <div className="absolute bottom-0 left-0 h-1 bg-[#7B61FF] transition-all duration-1000" 
                         style={{ width: activeStep >= i ? '100%' : '0%' }} />

                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-[10px] font-mono text-[#7B61FF] opacity-50">[{m.step}]</span>
                      <h3 className="text-2xl md:text-3xl font-sans font-bold text-white tracking-tight">
                        {m.title}
                      </h3>
                    </div>
                    
                    <p className="text-white/40 text-sm md:text-base leading-relaxed mb-0">
                      {m.description}
                    </p>

                    {/* Animated Construction Layer Decoration */}
                    {activeStep === i && (
                      <div className="absolute -right-4 -bottom-4 w-24 h-24 pointer-events-none opacity-10">
                         <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
                           <rect x="10" y="10" width="80" height="80" stroke="#7B61FF" strokeWidth="1" fill="none" />
                           <circle cx="50" cy="50" r="30" stroke="#7B61FF" strokeWidth="0.5" fill="none" />
                         </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Construction Visualization (Floating Elements) */}
                <div className={`hidden md:flex absolute left-1/2 -translate-x-1/2 w-[150px] h-[150px] items-center justify-center pointer-events-none z-20`}>
                   <div className={`
                     w-full h-full relative flex items-center justify-center transition-all duration-1000
                     ${activeStep >= i ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}
                   `}>
                     <ConstructionVisual type={m.visualType} isActive={activeStep === i} />
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
        .animate-scan {
          animation: scan 10s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

const ConstructionVisual = ({ type, isActive }) => {
  return (
    <div className={`relative flex items-center justify-center transition-all duration-500 ${isActive ? 'scale-110' : 'scale-100'}`}>
      {/* Background Glow */}
      <div className={`absolute w-20 h-20 bg-[#7B61FF]/20 blur-2xl rounded-full transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
      
      {/* SVG Icon/Visual based on type */}
      <svg className="w-16 h-16 relative z-10" viewBox="0 0 64 64" fill="none" stroke="#7B61FF" strokeWidth="1.5">
        {type === 'wireframe' && (
          <g className={isActive ? 'animate-pulse' : ''}>
            <rect x="8" y="8" width="48" height="48" rx="4" strokeDasharray="4 4" />
            <path d="M8 8 L56 56 M56 8 L8 56" strokeOpacity="0.5" />
          </g>
        )}
        {type === 'ui-panels' && (
          <g>
            <rect x="4" y="4" width="56" height="56" rx="2" strokeOpacity="0.3" />
            <rect x="10" y="10" width="44" height="12" fill="#7B61FF" fillOpacity="0.1" />
            <circle cx="16" cy="16" r="1.5" fill="#7B61FF" />
            <rect x="10" y="30" width="20" height="20" strokeOpacity="0.5" />
            <rect x="34" y="30" width="20" height="20" strokeOpacity="0.5" />
          </g>
        )}
        {type === 'motion-glow' && (
          <g>
             <circle cx="32" cy="32" r="20" strokeDasharray="10 5" className="animate-spin-slow" />
             <circle cx="32" cy="32" r="12" className={isActive ? 'animate-ping' : ''} />
          </g>
        )}
        {type === 'pipelines' && (
          <g>
            <path d="M10 32 H54 M32 10 V54" strokeWidth="2" />
            <circle cx="32" cy="32" r="6" fill="#05050a" strokeWidth="2" />
            <path d="M24 24 L40 40 M40 24 L24 40" strokeOpacity="0.5" />
          </g>
        )}
        {type === 'neural-pulse' && (
          <g>
            <circle cx="32" cy="32" r="8" fill="#7B61FF" fillOpacity="0.3" />
            <path d="M32 8 V20 M32 44 V56 M8 32 H20 M44 32 H56" strokeOpacity="0.8" />
            <path d="M15 15 L24 24 M40 40 L49 49" strokeOpacity="0.5" />
            <path d="M49 15 L40 24 M24 40 L15 49" strokeOpacity="0.5" />
          </g>
        )}
        {type === 'system-core' && (
          <g>
            <path d="M32 4 L60 20 V44 L32 60 L4 44 V20 Z" className={isActive ? 'animate-pulse' : ''} fill="#7B61FF" fillOpacity="0.1" />
            <circle cx="32" cy="32" r="10" strokeWidth="3" />
            <circle cx="32" cy="32" r="18" strokeOpacity="0.3" />
          </g>
        )}
      </svg>
    </div>
  );
};

export default BlueprintConstructionTimeline;

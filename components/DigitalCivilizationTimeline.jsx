import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * DigitalCivilizationTimeline
 * ──────────────────────────────────────────────────────────────
 * A premium, futuristic city-builder themed timeline.
 * 
 * Concept: Your growth as a developer builds a digital civilization.
 * Features:
 * - Rising holographic buildings
 * - Data pipelines & energy streams
 * - Neural AI core activation
 * - Cinematic atmospheric depth
 */

const milestones = [
  {
    step: "01",
    year: "2024",
    title: "Started Learning Web Development",
    body: "Learning HTML, CSS, JavaScript, and responsive design fundamentals. The very first line of code — the beginning of an obsession.",
    civilization: "Micro-grid structures and basic power lights activate.",
    tags: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    side: "left",
  },
  {
    step: "02",
    year: "2024",
    title: "Building Creative Digital Projects",
    body: "Created interactive websites, UI concepts, and portfolio experiments. Started treating every project as a design challenge, not just a coding task.",
    civilization: "Holographic billboards and interface towers arise.",
    tags: ["UI Design", "Projects", "GitHub"],
    side: "right",
  },
  {
    step: "03",
    year: "2025",
    title: "Vibe Code Developer Era",
    body: "Exploring cinematic UI, GSAP animations, Three.js, and motion design. Frontend stopped being functional — it became art.",
    civilization: "Motion districts and neon pathways ignite.",
    tags: ["GSAP", "Three.js", "React", "Motion Design"],
    side: "left",
  },
  {
    step: "04",
    year: "2025 →",
    title: "Exploring AI Engineering",
    body: "Currently learning intelligent systems, AI-powered product ideas, and future-focused development. Building at the intersection of creativity and intelligence.",
    civilization: "Neural AI core and advanced system skyline activates.",
    tags: ["AI Tools", "Prompt Engineering", "Intelligent Systems"],
    side: "right",
    isCurrent: true,
  },
];

const DigitalCivilizationTimeline = () => {
  const sectionRef = useRef(null);
  const cityRef = useRef(null);
  const cardRefs = useRef([]);
  const [activeStage, setActiveStage] = useState(-1);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardRefs.current.filter(Boolean);

    // 1. Progressively Reveal the City Skyline
    milestones.forEach((_, i) => {
      ScrollTrigger.create({
        trigger: cards[i],
        start: "top 70%",
        end: "bottom 30%",
        onEnter: () => setActiveStage(i),
        onEnterBack: () => setActiveStage(i),
        onLeaveBack: () => i === 0 ? setActiveStage(-1) : setActiveStage(i - 1)
      });

      // Animate Card Reveal
      gsap.fromTo(cards[i],
        { opacity: 0, y: 50, filter: "blur(10px)" },
        { 
          opacity: 1, y: 0, filter: "blur(0px)", 
          duration: 1.2, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: cards[i],
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // 2. Parallax City Layers
    const layers = gsap.utils.toArray('.city-layer');
    layers.forEach((layer, i) => {
      const speed = (i + 1) * 0.15;
      gsap.to(layer, {
        y: 100 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: true
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative min-h-screen bg-[#020205] py-40 overflow-hidden"
      id="civilization-timeline"
    >
      {/* ── Background Atmosphere & Fog ────────────────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#020205] via-[#7B61FF]/5 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-[#7B61FF]/10 blur-[120px] rounded-full animate-pulse-slow" />
      </div>

      {/* ── The Civilization Skyline (Fixed Visual Layer) ──────────────── */}
      <div className="fixed inset-0 z-10 pointer-events-none opacity-40">
        <div className="relative w-full h-full flex items-end justify-center">
          {/* Layered city silhouettes with glowing elements */}
          <CityLayer depth={1} activeStage={activeStage} />
          <CityLayer depth={2} activeStage={activeStage} />
          <CityLayer depth={3} activeStage={activeStage} />
        </div>
      </div>

      <div className="relative z-20 max-w-6xl mx-auto px-6">
        
        {/* Section Headers */}
        <div className="text-center mb-40">
          <p className="text-[10px] tracking-[0.8em] uppercase font-bold text-[#7B61FF]/60 mb-6">
            Developer Journey
          </p>
          <h2 className="text-4xl md:text-7xl font-sans font-black tracking-tighter text-white uppercase leading-none">
            Digital <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7B61FF] to-[#c864ff]">Civilization</span> Builder
          </h2>
          <p className="mt-8 text-white/40 text-sm md:text-lg max-w-lg mx-auto font-light leading-relaxed">
            "Not a resume. A story of becoming. <br/>
            Building my digital world step by step."
          </p>
        </div>

        {/* Timeline Flow */}
        <div className="relative">
          
          {/* Central Energy Stream */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 md:-translate-x-1/2 w-[1px] bg-white/5 overflow-hidden">
             <div className="w-full h-full bg-gradient-to-b from-transparent via-[#7B61FF] to-transparent animate-energy-flow" />
          </div>

          <div className="flex flex-col gap-32 md:gap-52">
            {milestones.map((m, i) => (
              <div 
                key={i}
                ref={el => cardRefs.current[i] = el}
                className={`relative flex items-center w-full pl-16 md:pl-0 ${m.side === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Node Link */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border border-[#7B61FF]/40 bg-[#020205] z-30 transition-all duration-500">
                  <div className={`absolute inset-0 rounded-full bg-[#7B61FF] transition-all duration-500 ${activeStage >= i ? 'scale-100 shadow-[0_0_15px_#7B61FF]' : 'scale-0'}`} />
                </div>

                {/* Milestone Card */}
                <div className={`w-full md:w-[45%] group ${m.side === 'left' ? 'md:mr-auto' : 'md:ml-auto'}`}>
                  <div className={`
                    relative p-8 md:p-12 rounded-3xl border transition-all duration-700
                    backdrop-filter backdrop-blur-sm
                    ${activeStage === i 
                      ? 'bg-white/[0.04] border-[#7B61FF]/50 shadow-[0_0_60px_rgba(123,97,255,0.15)] scale-[1.02]' 
                      : 'bg-white/[0.01] border-white/5 opacity-40'}
                  `}>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] tracking-widest font-black text-[#7B61FF]">0{i+1}</span>
                        <h3 className="text-2xl md:text-3xl font-sans font-bold text-white tracking-tight">{m.title}</h3>
                      </div>
                      <span className="text-[10px] tracking-widest font-bold text-white/20">{m.year}</span>
                    </div>
                    
                    <p className="text-white/50 text-sm md:text-base leading-relaxed mb-8">
                      {m.body}
                    </p>

                    {/* Current badge */}
                    {m.isCurrent && (
                      <div className="flex items-center gap-2 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-[#7B61FF]" />
                        <span className="text-[8px] tracking-[0.35em] font-bold uppercase text-[#7B61FF]">
                          Right Now
                        </span>
                      </div>
                    )}

                    {/* Civilization Insight (Subtext) */}
                    <div className="py-4 border-t border-white/5">
                      <p className="text-[10px] tracking-[0.2em] font-mono text-[#7B61FF] uppercase">
                        {m.civilization}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {m.tags.map(tag => (
                        <span key={tag} className="text-[9px] tracking-[0.1em] font-bold text-white/30 border border-white/10 px-3 py-1 rounded-full uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Hover Glow */}
                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
                         style={{ background: 'radial-gradient(circle at center, rgba(123,97,255,0.05) 0%, transparent 70%)' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes energy-flow {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-energy-flow {
          animation: energy-flow 3s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </section>
  );
};

const CityLayer = ({ depth, activeStage }) => {
  // Simple SVG silhouettes for the skyline
  return (
    <div 
      className={`city-layer absolute bottom-0 left-0 w-full flex items-end justify-around transition-all duration-1000 ${depth === 1 ? 'opacity-30' : depth === 2 ? 'opacity-20 translate-y-10' : 'opacity-10 translate-y-20'}`}
      style={{ height: `${20 + depth * 10}%` }}
    >
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex flex-col items-center">
          {/* Animated Hologram Billboard for Interface Layer */}
          {activeStage >= 1 && i % 3 === 0 && (
             <div className="w-12 h-16 bg-[#7B61FF]/20 border border-[#7B61FF]/40 mb-2 animate-pulse flex items-center justify-center">
                <div className="w-8 h-[2px] bg-[#7B61FF] animate-energy-flow" />
             </div>
          )}
          {/* Building Silhouettes */}
          <div 
            className={`w-12 md:w-20 rounded-t-sm transition-all duration-1000 ease-out`}
            style={{ 
              height: `${20 + (i * 15) % 60}%`, 
              background: depth === 1 ? '#0a0a1a' : depth === 2 ? '#050510' : '#020205',
              transform: activeStage >= i ? 'translateY(0)' : 'translateY(100%)',
              borderLeft: '1px solid rgba(123,97,255,0.05)',
              borderRight: '1px solid rgba(123,97,255,0.05)',
            }}
          >
             {/* Window Lights */}
             {activeStage >= 0 && (
               <div className="grid grid-cols-2 gap-1 p-2 opacity-20">
                  {[...Array(12)].map((_, j) => (
                    <div key={j} className={`w-1 h-1 rounded-sm ${activeStage >= i ? 'bg-[#7B61FF]' : 'bg-transparent'}`} />
                  ))}
               </div>
             )}
          </div>
        </div>
      ))}

      {/* AI Core (Neural Energy Sphere) */}
      {activeStage >= 4 && (
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-40 h-40">
           <div className="absolute inset-0 bg-[#7B61FF]/20 blur-[60px] rounded-full animate-ping" />
           <div className="absolute inset-4 border border-[#7B61FF]/40 rounded-full animate-spin-slow" />
           <div className="absolute inset-10 bg-gradient-to-b from-[#7B61FF] to-[#c864ff] rounded-full shadow-[0_0_40px_#7B61FF]" />
        </div>
      )}
    </div>
  );
};

export default DigitalCivilizationTimeline;

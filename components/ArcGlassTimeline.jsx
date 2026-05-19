import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * ARC GLASS TIMELINE
 * ──────────────────────────────────────────────────────────────
 * A premium cinematic timeline where cards travel along a smooth
 * curved arc path from right to left.
 * Inspired by Noomo-style immersive storytelling.
 */

const stages = [
  {
    id: 1,
    title: "Foundation Layer",
    body: "Started learning HTML, CSS, JavaScript, and responsive web design fundamentals.",
    tags: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    color: "#7B61FF"
  },
  {
    id: 2,
    title: "Creative Frontend Layer",
    body: "Exploring UI/UX, frontend creativity, interactive interfaces, and modern web design.",
    tags: ["UI/UX", "Frontend", "Interaction", "Web Design"],
    color: "#30E3CA"
  },
  {
    id: 3,
    title: "Vibe Code Developer Layer",
    body: "Building cinematic web experiences using motion design, GSAP, Three.js, and AI-assisted workflows.",
    tags: ["GSAP", "Three.js", "Motion UI", "AI-assisted Coding"],
    color: "#c864ff"
  },
  {
    id: 4,
    title: "Backend Learning Layer",
    body: "Learning APIs, databases, authentication, debugging, and backend system flow.",
    tags: ["Node.js", "Express", "MongoDB", "Firebase", "Debugging"],
    color: "#4d79ff"
  },
  {
    id: 5,
    title: "AI Engineering Exploration",
    body: "Exploring AI tools, intelligent systems, automation, and future-focused product development.",
    tags: ["AI Tools", "Automation", "Prompt Engineering", "Intelligent Systems"],
    color: "#ff00ff"
  },
  {
    id: 6,
    title: "Industry-Ready Direction",
    body: "Improving practical skills, solving real problems, and preparing for real-world industry challenges.",
    tags: ["Problem Solving", "Real Projects", "Deployment", "Continuous Learning"],
    color: "#ffffff"
  }
];

const ArcGlassTimeline = () => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    const cards = cardsRef.current;

    // 1. Arc Scroll Animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: `+=${stages.length * 150}%`, // Longer scroll for smoothness
        pin: true,
        scrub: 1,
        snap: 1 / (stages.length - 1),
      }
    });

    // Animate each card along the arc
    cards.forEach((card, i) => {
      // Calculate start and end offsets
      const offset = i / (stages.length - 1);
      
      tl.fromTo(card, 
        { 
          x: "150%", 
          y: 200, 
          scale: 0.5, 
          rotationY: 45, 
          rotationZ: 10, 
          opacity: 0, 
          filter: "blur(20px)" 
        },
        {
          // Mid point (Active)
          x: "0%", 
          y: 0, 
          scale: 1, 
          rotationY: 0, 
          rotationZ: 0, 
          opacity: 1, 
          filter: "blur(0px)",
          immediateRender: false,
          scrollTrigger: {
            trigger: container,
            start: `${(i / stages.length) * 100}%`,
            end: `${((i + 1) / stages.length) * 100}%`,
            scrub: true,
          }
        },
        i === 0 ? 0 : ">-0.5" // Overlap animations
      ).to(card, {
          // Exit point
          x: "-150%", 
          y: 200, 
          scale: 0.5, 
          rotationY: -45, 
          rotationZ: -10, 
          opacity: 0, 
          filter: "blur(20px)",
      });
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-screen bg-[#020205] overflow-hidden flex items-center justify-center perspective-[2000px]"
      id="arc-timeline"
    >
      {/* ── Background Elements ───────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_50%,rgba(123,97,255,0.05)_0%,transparent_70%)] opacity-40" />
        {/* Arc Path Visual Line */}
        <div className="absolute top-[60%] left-[-10%] w-[120%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent blur-sm rotate-[2deg]" />
        
        {/* Cinematic Noise Texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* ── Floating Arc Cards ────────────────────────────────────────── */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
         {stages.map((stage, i) => (
           <div 
             key={stage.id}
             ref={el => cardsRef.current[i] = el}
             className="absolute w-full max-w-2xl px-6 pointer-events-none"
             style={{ transformStyle: 'preserve-3d' }}
           >
             <GlassCard stage={stage} index={i} />
           </div>
         ))}
      </div>

      {/* ── Progress HUD ────────────────────────────────────────────── */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4">
         <span className="text-[10px] font-mono text-white/20 tracking-[0.5em] uppercase mr-4">Timeline_Arc</span>
         {stages.map((_, i) => (
           <div key={i} className="w-10 h-[1px] bg-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-[#7B61FF] scale-x-0 origin-left" id={`progress-dot-${i}`} />
           </div>
         ))}
      </div>

      <style jsx>{`
        #arc-timeline {
          background: radial-gradient(circle at 50% 50%, #050510 0%, #020205 100%);
        }
      `}</style>
    </section>
  );
};

const GlassCard = ({ stage, index }) => {
  return (
    <div className="relative p-10 md:p-16 rounded-[3rem] border border-white/10 bg-white/[0.02] backdrop-blur-3xl shadow-2xl overflow-hidden pointer-events-auto">
      {/* Water/Glass Reflection Overlay */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
         <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-glass-shine" />
      </div>

      <div className="relative z-10">
        <p className="text-[10px] tracking-[0.8em] font-black text-[#7B61FF] uppercase mb-8">
           Sequence 0{index + 1}
        </p>
        
        <h3 className="text-3xl md:text-6xl font-sans font-black italic tracking-tighter text-white mb-6 leading-none">
           {stage.title}
        </h3>
        
        <p className="text-base md:text-lg font-light text-white/50 leading-relaxed mb-10 max-w-md">
           {stage.body}
        </p>

        <div className="flex flex-wrap gap-2">
           {stage.tags.map(tag => (
             <span key={tag} className="text-[8px] tracking-widest font-bold text-white/30 border border-white/10 px-3 py-1.5 rounded-full uppercase">
                {tag}
             </span>
           ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes glass-shine {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        .animate-glass-shine {
          animation: glass-shine 12s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ArcGlassTimeline;

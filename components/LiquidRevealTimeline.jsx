import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * LIQUID REVEAL TIMELINE + INK DROP RIPPLE
 * ──────────────────────────────────────────────────────────────
 * A premium cinematic experience featuring liquid motion design.
 * Concept: Memories emerging through liquid energy.
 */

const stages = [
  {
    id: 1,
    title: "Foundation Layer",
    body: "Started learning HTML, CSS, JavaScript, and responsive web fundamentals.",
    meaning: "The beginning of an obsession.",
    color: "#7B61FF",
    glow: "rgba(123, 97, 255, 0.2)"
  },
  {
    id: 2,
    title: "Creative Frontend Layer",
    body: "Exploring UI/UX, frontend creativity, and modern web design concepts.",
    meaning: "Where code meets aesthetic.",
    color: "#30E3CA",
    glow: "rgba(48, 227, 202, 0.2)"
  },
  {
    id: 3,
    title: "Vibe Code Developer Era",
    body: "Exploring cinematic UI, GSAP animations, and motion design workflows.",
    meaning: "Frontend stopped being functional — it became art.",
    color: "#c864ff",
    glow: "rgba(200, 100, 255, 0.2)"
  },
  {
    id: 4,
    title: "Backend Systems Layer",
    body: "Learning APIs, databases, backend logic, and system architecture.",
    meaning: "The engine beneath the beauty.",
    color: "#4d79ff",
    glow: "rgba(77, 121, 255, 0.2)"
  },
  {
    id: 5,
    title: "AI Exploration Layer",
    body: "Exploring AI tools, intelligent systems, and future-focused development.",
    meaning: "The horizon of digital intelligence.",
    color: "#ff00ff",
    glow: "rgba(255, 0, 255, 0.2)"
  },
  {
    id: 6,
    title: "Final Industry Direction",
    body: "Continuous improvement of problem-solving and real-world thinking.",
    meaning: "Evolution is a continuous flow.",
    color: "#ffffff",
    glow: "rgba(255, 255, 255, 0.15)"
  }
];

const LiquidRevealTimeline = () => {
  const containerRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    // 1. Line Progress Animation
    gsap.fromTo(lineRef.current, 
      { scaleY: 0 },
      { 
        scaleY: 1, 
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 20%",
          end: "bottom 80%",
          scrub: 1
        }
      }
    );

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative py-40 px-6 md:px-20 bg-[#020205] overflow-hidden"
      id="liquid-timeline"
    >
      {/* ── Background Atmosphere ─────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-[#7B61FF]/5 blur-[120px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-[#c864ff]/5 blur-[120px] rounded-full animate-pulse-slow-reverse" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* Title */}
        <div className="text-center mb-40">
           <h2 className="text-4xl md:text-7xl font-sans font-black italic tracking-tighter text-white uppercase leading-none">
             Liquid Memory <br/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7B61FF] to-[#c864ff]">Timeline</span>
           </h2>
           <p className="mt-8 text-white/40 text-sm md:text-lg max-w-lg mx-auto font-light italic">
             "Preserved experiences emerging through liquid energy."
           </p>
        </div>

        <div className="relative">
          
          {/* ── Central Liquid Flow Line ──────────────────────────────── */}
          <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-white/5">
            <div 
              ref={lineRef} 
              className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#7B61FF] via-[#c864ff] to-[#7B61FF] origin-top shadow-[0_0_15px_#7B61FF]"
            />
            {/* Liquid Glow Pulse */}
            <div className="absolute inset-0 w-full h-20 bg-gradient-to-b from-transparent via-white/40 to-transparent animate-liquid-flow pointer-events-none" />
          </div>

          <div className="flex flex-col gap-32 md:gap-48">
            {stages.map((stage, i) => (
              <TimelineItem key={stage.id} stage={stage} index={i} />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes liquid-flow {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(1000%); }
        }
        .animate-liquid-flow {
          animation: liquid-flow 10s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse 12s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-pulse-slow-reverse {
          animation: pulse 15s cubic-bezier(0.4, 0, 0.6, 1) infinite reverse;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
      `}</style>
    </section>
  );
};

// ─── Component: Individual Timeline Item ───────────────────────────────────
const TimelineItem = ({ stage, index }) => {
  const itemRef = useRef(null);
  const rippleRef = useRef(null);
  const cardRef = useRef(null);
  const waveRef = useRef(null);

  useEffect(() => {
    const item = itemRef.current;
    const ripple = rippleRef.current;
    const card = cardRef.current;
    const wave = waveRef.current;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: "top 70%",
        toggleActions: "play none none reverse"
      }
    });

    // 1. Ink Ripple Animation
    tl.fromTo(ripple, 
      { scale: 0.5, opacity: 0 },
      { scale: 3, opacity: 1, duration: 0.8, ease: "power2.out" }
    )
    .to(ripple, { opacity: 0, duration: 1 }, "-=0.2");

    // 2. Liquid Reveal Wave
    tl.fromTo(wave,
      { x: "-100%" },
      { x: "100%", duration: 1.5, ease: "power3.inOut" },
      "-=1.2"
    );

    // 3. Card Reveal
    tl.fromTo(card,
      { opacity: 0.2, blur: 10, scale: 0.95 },
      { opacity: 1, blur: 0, scale: 1, duration: 1.2, ease: "power3.out" },
      "-=1.0"
    );

    // 4. Content Stagger
    tl.fromTo(card.querySelectorAll('.stagger-content'),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" },
      "-=0.6"
    );

  }, []);

  const isLeft = index % 2 === 0;

  return (
    <div ref={itemRef} className={`relative flex items-center w-full pl-16 md:pl-0 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
      
      {/* ── Ink Drop Ripple Dot ────────────────────────────────────────── */}
      <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 z-20">
         <div 
           ref={rippleRef} 
           className="absolute inset-0 rounded-full border border-white/40 pointer-events-none" 
           style={{ borderColor: stage.color }}
         />
         <div 
           className="w-full h-full rounded-full bg-white z-10 shadow-[0_0_15px_rgba(255,255,255,0.8)]"
           style={{ background: stage.color }}
         />
      </div>

      {/* ── Liquid Glass Card ─────────────────────────────────────────── */}
      <div className={`w-full md:w-[45%] group ${isLeft ? 'md:mr-auto' : 'md:ml-auto'}`}>
        <div 
          ref={cardRef}
          className="relative p-10 md:p-14 rounded-[2.5rem] border border-white/10 bg-white/[0.03] backdrop-blur-3xl overflow-hidden group-hover:border-white/20 transition-all duration-700"
        >
          {/* Liquid Wave Reveal Overlay (Clip Path simulation) */}
          <div 
            ref={waveRef}
            className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
          />

          {/* Glass Reflection Sweep */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
             <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-shine" />
          </div>

          <div className="relative z-20">
            <div className="flex items-center justify-between mb-8 stagger-content">
               <span className="text-[10px] tracking-[0.5em] font-black text-white/30 uppercase">Node 0{index + 1}</span>
               <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: stage.color, boxShadow: `0 0 10px ${stage.color}` }} />
            </div>

            <h3 className="text-3xl md:text-5xl font-sans font-black italic tracking-tighter text-white mb-6 leading-none stagger-content">
               {stage.title}
            </h3>
            
            <p className="text-base md:text-lg font-light text-white/50 leading-relaxed mb-10 stagger-content">
              {stage.body}
            </p>

            <div className="flex items-center gap-6 pt-10 border-t border-white/5 stagger-content">
               <div className="flex flex-col">
                  <span className="text-[8px] font-mono text-white/20 uppercase mb-2 tracking-[0.2em]">Liquid Insight</span>
                  <span className="text-xs md:text-sm tracking-[0.3em] uppercase font-bold italic" style={{ color: stage.color }}>
                    {stage.meaning}
                  </span>
               </div>
            </div>
          </div>

          {/* Background Liquid Glow */}
          <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full blur-[80px] pointer-events-none transition-all duration-1000 group-hover:scale-150" 
               style={{ background: stage.glow }} />
        </div>
      </div>

      <style jsx>{`
        .animate-shine {
          animation: shine 4s infinite linear;
        }
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
};

export default LiquidRevealTimeline;

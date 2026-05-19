import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Timeline data ───────────────────────────────────────────────────────────
const milestones = [
  {
    step: "01",
    year: "2024",
    title: "Started Learning Web Development",
    body: "Learning HTML, CSS, JavaScript, and responsive design fundamentals. The very first line of code — the beginning of an obsession.",
    tags: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    side: "left",
  },
  {
    step: "02",
    year: "2024",
    title: "Building Creative Digital Projects",
    body: "Created interactive websites, UI concepts, and portfolio experiments. Started treating every project as a design challenge, not just a coding task.",
    tags: ["UI Design", "Projects", "GitHub"],
    side: "right",
  },
  {
    step: "03",
    year: "2025",
    title: "Vibe Code Developer Era",
    body: "Exploring cinematic UI, GSAP animations, Three.js, and motion design. Frontend stopped being functional — it became art.",
    tags: ["GSAP", "Three.js", "React", "Motion Design"],
    side: "left",
  },
  {
    step: "04",
    year: "2025 →",
    title: "Exploring AI Engineering",
    body: "Currently learning intelligent systems, AI-powered product ideas, and future-focused development. Building at the intersection of creativity and intelligence.",
    tags: ["AI Tools", "Prompt Engineering", "Intelligent Systems"],
    side: "right",
    isCurrent: true,
  },
];

const DeveloperJourneyTimeline = () => {
  const sectionRef  = useRef(null);
  const lineRef     = useRef(null);
  const cardsRef    = useRef([]);
  const nodesRef    = useRef([]);
  const rowsRef     = useRef([]); // Needed to get the exact Y offset of each milestone row
  const rocketRef   = useRef(null);

  const [activeStage, setActiveStage] = useState(0); // 0 is start, 1-4 are milestone upgrades

  useEffect(() => {
    const section = sectionRef.current;
    const line    = lineRef.current;
    const cards   = cardsRef.current.filter(Boolean);
    const nodes   = nodesRef.current.filter(Boolean);
    const rows    = rowsRef.current.filter(Boolean);

    // ── 1. Timeline line draws itself on scroll ───────────────────────────
    gsap.fromTo(line,
      { scaleY: 0, transformOrigin: "top center" },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          end:   "bottom 80%",
          scrub: 1.5,
        }
      }
    );

    // ── 2. Cards reveal — staggered slide + fade ──────────────────────────
    cards.forEach((card, i) => {
      const isLeft = milestones[i]?.side === "left";

      gsap.fromTo(card,
        { opacity: 0, x: isLeft ? -60 : 60, y: 30 },
        {
          opacity: 1, x: 0, y: 0,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            once:  true,
          }
        }
      );
    });

    // ── 3. Node glow pulses & Cinematic Rocket Movement ───────────────────
    // Start rocket slightly above the first row
    gsap.set(rocketRef.current, { y: -50 });

    rows.forEach((row, i) => {
      const node = nodes[i];
      const card = cards[i];
      
      ScrollTrigger.create({
        trigger: row,
        start: "top 55%", // Triggers when the row approaches the middle of the screen
        end: "bottom 45%",
        onEnter: () => {
          // Node active glow state
          gsap.to(node, { boxShadow: "0 0 24px 6px rgba(123,97,255,0.6)", scale: 1.3, duration: 0.4 });
          
          // Card cinematic activation glow
          gsap.to(card, { boxShadow: "0 0 50px rgba(123,97,255,0.15)", borderColor: "rgba(123,97,255,0.4)", duration: 0.6 });
          
          // Upgrade rocket stage state
          setActiveStage(i + 1);
          
          // Fly rocket to this node's exact Y position relative to the timeline wrapper
          // We calculate the row's offsetTop plus a small padding to align the rocket with the node
          const yPos = row.offsetTop + 20; 
          
          gsap.to(rocketRef.current, { 
            y: yPos, 
            duration: 1.2, 
            ease: "back.out(1.2)", // Bouncy stop to feel like it's braking/docking
            onStart: () => {
              // Tilt rocket forward slightly while moving down
              gsap.to(rocketRef.current, { rotation: 10, duration: 0.2 });
            },
            onComplete: () => {
              // Level rocket back when stopped
              gsap.to(rocketRef.current, { rotation: 0, duration: 0.4, ease: "bounce.out" });
            }
          });
        },
        onLeaveBack: () => {
          // Restore idle states when scrolling back up
          gsap.to(node, { boxShadow: "0 0 8px 2px rgba(123,97,255,0.2)",  scale: 1,   duration: 0.4 });
          gsap.to(card, { boxShadow: milestones[i].isCurrent ? "0 0 40px rgba(123,97,255,0.08)" : "0 4px 40px rgba(0,0,0,0.3)", borderColor: milestones[i].isCurrent ? "rgba(123,97,255,0.4)" : "rgba(255,255,255,0.06)", duration: 0.5 });
          
          // Downgrade stage and move rocket up
          const prevStage = i === 0 ? 0 : i;
          setActiveStage(prevStage);
          
          const yPos = i === 0 ? -50 : rows[i - 1].offsetTop + 20;
          gsap.to(rocketRef.current, { 
            y: yPos, 
            duration: 1, 
            ease: "power2.out",
            onStart: () => gsap.to(rocketRef.current, { rotation: -10, duration: 0.2 }),
            onComplete: () => gsap.to(rocketRef.current, { rotation: 0, duration: 0.3 })
          });
        }
      });
    });

    // ── 4. Subtle parallax on mouse move ─────────────────────────────────
    const handleMouse = (e) => {
      const xR = (e.clientX / window.innerWidth  - 0.5) * 12;
      const yR = (e.clientY / window.innerHeight - 0.5) * 8;
      cards.forEach((card, i) => {
        const depth = (i % 3 + 1) * 0.6;
        gsap.to(card, { x: xR * depth, y: yR * depth, duration: 1.4, ease: "power1.out", overwrite: "auto" });
      });
    };
    window.addEventListener("mousemove", handleMouse);

    // Re-calculate ScrollTriggers on window load / resize to ensure exact rocket Y positions
    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="relative py-40 px-6 md:px-20 overflow-hidden"
      style={{ background: "#0d0d0d" }}
    >
      {/* ── Background ambient glows ────────────────────────────────────── */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full pointer-events-none"
           style={{ background: "radial-gradient(circle, rgba(123,97,255,0.06) 0%, transparent 70%)", filter: "blur(80px)" }} />
      <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] rounded-full pointer-events-none"
           style={{ background: "radial-gradient(circle, rgba(200,100,255,0.04) 0%, transparent 70%)", filter: "blur(80px)" }} />

      {/* ── Section label ───────────────────────────────────────────────── */}
      <div className="text-center mb-28 relative z-10">
        <p className="text-[10px] tracking-[0.6em] uppercase font-bold mb-6"
           style={{ color: "rgba(255,255,255,0.2)" }}>
          Developer Journey
        </p>
        <h2 className="font-sans font-black tracking-tighter leading-[0.88] text-white"
            style={{ fontSize: "clamp(3rem,8vw,6rem)" }}>
          The Evolution
        </h2>
        <p className="mt-6 text-base font-light max-w-md mx-auto leading-relaxed"
           style={{ color: "rgba(255,255,255,0.35)" }}>
          Not a resume. A story of becoming.
        </p>
      </div>

      {/* ── Timeline wrapper ────────────────────────────────────────────── */}
      <div className="relative max-w-5xl mx-auto z-10">

        {/* Vertical line */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 md:-translate-x-1/2 w-px overflow-hidden"
             style={{ background: "rgba(255,255,255,0.05)" }}>
          <div
            ref={lineRef}
            className="w-full h-full"
            style={{ background: "linear-gradient(to bottom, rgba(123,97,255,0.8), rgba(200,100,255,0.4))", transformOrigin: "top center" }}
          />
        </div>

        {/* Rocket Animation Layer */}
        {/* We place it outside overflow-hidden so the glowing trail and wings are fully visible */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 md:-translate-x-1/2 w-0 z-30 pointer-events-none flex justify-center">
          <div ref={rocketRef} className="absolute -top-10 w-12 h-16 flex items-center justify-center">
            <Rocket stage={activeStage} />
          </div>
        </div>

        {/* Milestone cards */}
        <div className="flex flex-col gap-16 md:gap-28">
          {milestones.map((m, i) => (
            <MilestoneRow
              key={i}
              milestone={m}
              index={i}
              rowRef={el => (rowsRef.current[i] = el)}
              cardRef={el => (cardsRef.current[i] = el)}
              nodeRef={el => (nodesRef.current[i] = el)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Rocket SVG Component (Dynamic Stages) ──────────────────────────────────
const Rocket = ({ stage }) => {
  // Stage logic (Matches your prompt exactly):
  // 0: Simple paper outline
  // 1: Stronger outline + small wings
  // 2: Ion glowing trail added
  // 3: Orange booster fire added
  // 4: Futuristic full glow (Final ready-for-industry stage)

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full transition-all duration-1000 ease-in-out">
      
      {/* Dynamic Trail / Fire Elements */}
      <div className="absolute top-[85%] flex flex-col items-center">
        {/* Stage 3+ Booster Engine Fire */}
        <div className={`w-2 rounded-full bg-gradient-to-b from-[#ff8c00] via-[#ffaa00] to-transparent transition-all duration-500 ease-in-out animate-pulse origin-top ${stage >= 3 ? 'h-8 opacity-100' : 'h-0 opacity-0'}`} />
        
        {/* Stage 2+ Ion Light Trail */}
        <div className={`w-[2px] rounded-full bg-gradient-to-b from-[#7B61FF] to-transparent transition-all duration-1000 ease-in-out origin-top blur-[1px] absolute top-0 ${stage >= 2 ? (stage >= 4 ? 'h-40 opacity-100 w-1 blur-[2px]' : 'h-20 opacity-70') : 'h-0 opacity-0'}`} />
        
        {/* Particle bursts on final stage */}
        {stage >= 4 && (
          <div className="absolute top-2 w-8 h-8 opacity-40 animate-ping rounded-full bg-[#7B61FF]" />
        )}
      </div>

      {/* The Rocket Ship SVG Layer */}
      <svg 
        viewBox="0 0 64 64" 
        className={`relative z-10 w-12 h-12 transition-all duration-700 ease-in-out ${stage >= 4 ? 'drop-shadow-[0_0_15px_rgba(123,97,255,0.8)] scale-110' : stage >= 2 ? 'drop-shadow-[0_0_5px_rgba(123,97,255,0.4)]' : ''}`}
        fill="none" 
        stroke={stage >= 4 ? "#c864ff" : stage >= 1 ? "#7B61FF" : "rgba(255,255,255,0.3)"}
        strokeWidth={stage >= 1 ? "3" : "2"}
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        {/* Main Body (Paper rocket shape changing to metal fuselage) */}
        <path d="M32 4 L44 36 L32 50 L20 36 Z" 
              fill={stage >= 4 ? "rgba(123,97,255,0.2)" : stage >= 2 ? "rgba(255,255,255,0.03)" : "none"} 
              className="transition-all duration-1000" />
        
        {/* Inner Crease Line */}
        <path d="M32 4 L32 50" strokeWidth={stage >= 1 ? "2" : "1"} className="transition-colors duration-1000" />
        
        {/* Stage 1+ Small Wings/Fins */}
        <path d="M44 36 L54 46 L40 44" className={`transition-all duration-500 origin-center ${stage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />
        <path d="M20 36 L10 46 L24 44" className={`transition-all duration-500 origin-center ${stage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />
        
        {/* Stage 4 Futuristic Details (Cockpit Window & Fin accents) */}
        <circle cx="32" cy="24" r="3" className={`transition-all duration-700 ${stage >= 4 ? 'opacity-100' : 'opacity-0'}`} fill="#fff" stroke="none" />
        <path d="M32 4 L32 10" stroke="#fff" strokeWidth="2" className={`transition-all duration-700 ${stage >= 4 ? 'opacity-100' : 'opacity-0'}`} />
      </svg>
    </div>
  );
};


// ─── Single milestone row ────────────────────────────────────────────────────
const MilestoneRow = ({ milestone, index, rowRef, cardRef, nodeRef }) => {
  const { step, year, title, body, tags, side, isCurrent } = milestone;
  const isLeft = side === "left";

  return (
    <div ref={rowRef} className={`relative flex items-center w-full pl-16 md:pl-0 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}>

      {/* Card ──────────────────────────────────────────────────────────── */}
      <div
        ref={cardRef}
        className={`w-full md:w-[44%] group relative rounded-3xl p-6 md:p-10
          transition-all duration-700 hover:-translate-y-2 hover:scale-[1.02]
          ${isLeft ? "md:mr-auto" : "md:ml-auto"}`}
        style={{
          background: "rgba(255,255,255,0.03)",
          border:     isCurrent
            ? "1px solid rgba(123,97,255,0.4)"
            : "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(16px)",
          boxShadow: isCurrent
            ? "0 0 40px rgba(123,97,255,0.08)"
            : "0 4px 40px rgba(0,0,0,0.3)",
        }}
      >
        {/* Step + Year row */}
        <div className="flex items-center gap-4 mb-4 md:mb-5">
          <span className="text-[10px] tracking-[0.4em] font-bold uppercase"
                style={{ color: "rgba(123,97,255,0.7)" }}>
            {step}
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
          <span className="text-[10px] tracking-[0.3em] font-bold uppercase"
                style={{ color: "rgba(255,255,255,0.2)" }}>
            {year}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif italic font-normal leading-snug mb-4 text-white"
            style={{ fontSize: "clamp(1.2rem,3vw,2rem)" }}>
          {title}
        </h3>

        {/* Body */}
        <p className="text-xs md:text-sm leading-relaxed mb-6"
           style={{ color: "rgba(255,255,255,0.4)" }}>
          {body}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, ti) => (
             <span
              key={ti}
              className="text-[8px] md:text-[9px] tracking-[0.25em] uppercase font-bold px-3 py-1 rounded-full"
              style={{
                background: "rgba(123,97,255,0.1)",
                border: "1px solid rgba(123,97,255,0.2)",
                color: "rgba(123,97,255,0.8)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Current badge */}
        {isCurrent && (
          <div className="absolute -top-3 left-6 md:left-8 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: "#7B61FF" }} />
            <span className="text-[8px] tracking-[0.35em] font-bold uppercase px-3 py-1 rounded-full"
                  style={{ background: "rgba(123,97,255,0.15)", color: "rgba(123,97,255,1)", border: "1px solid rgba(123,97,255,0.3)" }}>
              Right Now
            </span>
          </div>
        )}

        {/* Hover border glow */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
             style={{ boxShadow: "inset 0 0 30px rgba(123,97,255,0.08)" }} />
      </div>

      {/* Center Node ───────────────────────────────────────────────────── */}
      <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
        <div
          ref={nodeRef}
          className="w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-500"
          style={{
            background: isCurrent ? "#7B61FF" : "rgba(123,97,255,0.5)",
            boxShadow: isCurrent
              ? "0 0 16px 4px rgba(123,97,255,0.5)"
              : "0 0 8px 2px rgba(123,97,255,0.2)",
          }}
        />
      </div>
    </div>
  );
};

export default DeveloperJourneyTimeline;

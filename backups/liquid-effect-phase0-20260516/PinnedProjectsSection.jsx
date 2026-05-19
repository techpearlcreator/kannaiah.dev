import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LiquidProjectCard from './LiquidProjectCard';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "Aura Digital",
    description: "A next-generation digital ecosystem for high-end fashion brands, blending immersive WebGL experiences with seamless e-commerce flow.",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1200",
    tags: ["WebGL", "Next.js", "Design"],
    link: "#"
  },
  {
    title: "Vivid Essence",
    description: "Crafting a cinematic identity for a luxury fragrance house. Focus on fluid transitions and atmospheric visual storytelling.",
    image: "https://images.unsplash.com/photo-1594122230689-45899d9e6f69?auto=format&fit=crop&q=80&w=1200",
    tags: ["Creative Direction", "3D", "Motion"],
    link: "#"
  },
  {
    title: "Nova Labs",
    description: "An experimental platform exploring the intersection of AI-driven data visualization and human-centric interface design.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
    tags: ["AI", "React", "Data Visualization"],
    link: "#"
  },
  {
    title: "Zenith Studio",
    description: "Reimagining the portfolio experience for a global architectural firm, emphasizing space, light, and minimalist structural beauty.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
    tags: ["Architecture", "Branding", "UI/UX"],
    link: "#"
  }
];

/**
 * PinnedProjectsSection
 * ──────────────────────────────────────────────────────────────
 * - Full-screen height section with pinning.
 * - Minimal, cinematic aesthetic (White/Cream).
 * - Smooth snapping between project showcases.
 */
const PinnedProjectsSection = () => {
  const triggerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1024px)');
    const handleMediaChange = (e) => setIsMobile(e.matches);
    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: "top top",
        end: `+=${projects.length * 100}%`,
        pin: true,
        scrub: 1,
        snap: {
          snapTo: 1 / (projects.length - 1),
          duration: 0.5,
          delay: 0.1,
          ease: "power2.inOut"
        },
        onUpdate: (self) => {
          const index = Math.round(self.progress * (projects.length - 1));
          setActiveIndex(index);
        }
      });
    }, triggerRef);

    return () => ctx.revert();
  }, [isMobile]); // Removed activeIndex from dependencies to prevent ScrollTrigger recreation

  return (
    <div ref={triggerRef} className="relative w-full bg-[#fcfaf7]">
      {/* Background Grid or Noise (Subtle) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')` }} 
      />

      <section className="relative h-screen w-full overflow-hidden">
        {/* Navigation / Progress Sidebar */}
        {!isMobile && (
          <div className="absolute top-1/2 left-8 -translate-y-1/2 z-50 flex flex-col gap-6">
            {projects.map((_, i) => (
              <div 
                key={i} 
                className="group flex items-center gap-4 cursor-pointer"
                onClick={() => {
                   // Scroll to the specific project (optional: implement scroll-to logic)
                }}
              >
                <div className={`w-1 h-8 rounded-full transition-all duration-500 ${i === activeIndex ? 'bg-[#1a1a1a] scale-y-150' : 'bg-[#1a1a1a]/10 group-hover:bg-[#1a1a1a]/30'}`} />
                <span className={`text-[10px] font-bold tracking-widest uppercase transition-all duration-500 ${i === activeIndex ? 'opacity-100 x-0' : 'opacity-0 -translate-x-2'}`}>
                  0{i + 1}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Global Section Header */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
          <span className="text-[10px] font-black tracking-[0.6em] uppercase text-[#1a1a1a]/30">Featured Works</span>
          <div className="w-px h-12 bg-[#1a1a1a]/10 mt-4" />
        </div>

        {/* Project Rendering */}
        <div className="relative w-full h-full">
          {isMobile ? (
            // Mobile: Stacked layout
            <div className="flex flex-col">
              {projects.map((project, i) => (
                <LiquidProjectCard 
                  key={i} 
                  {...project} 
                  isActive={true} 
                  isMobile={true} 
                />
              ))}
            </div>
          ) : (
            // Desktop: Pinned transitions
            projects.map((project, i) => (
              <LiquidProjectCard 
                key={i} 
                {...project} 
                isActive={i === activeIndex} 
                isMobile={false} 
              />
            ))
          )}
        </div>

        {/* Footer info */}
        {!isMobile && (
          <div className="absolute bottom-12 right-12 z-50 flex items-center gap-8">
             <div className="flex flex-col items-end">
                <span className="text-[9px] font-bold tracking-widest text-[#1a1a1a]/40 uppercase">Selected Archive</span>
                <span className="text-xs font-serif italic text-[#1a1a1a]">Vol. 02 — 2024</span>
             </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default PinnedProjectsSection;

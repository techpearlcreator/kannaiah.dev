import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LiquidProjectCard from './LiquidProjectCard';
import { preloadLiquidProjectTexture } from './liquidProjectTexture';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "Beans & Blooms",
    description: "Fresh Brew is a self-made demo cafe project created to showcase my frontend skills, with warm coffee visuals, offer sections, product cards, quantity-based ordering, and a polished visit/order flow.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1200",
    liquidVideo: "https://www.w3schools.com/html/mov_bbb.mp4",
    tags: ["Demo Project", "Frontend Showcase", "Live Site"],
    link: "https://techpearlcreator.github.io/BeansAndBlooms/"
  },
  {
    title: "Free\nLance\nWork",
    description: "As a freelance vibe-code developer, I build responsive websites and mobile application experiences for real needs, turning ideas into clean UI, fast prototypes, and launch-ready digital products.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200",
    liquidVideo: "https://www.w3schools.com/html/mov_bbb.mp4",
    tags: ["Freelancer", "Vibe Code Developer", "Web & Mobile"],
    link: "https://www.linkedin.com/in/kannaiah-s-834811356"
  },
  {
    title: "Port\nFolio",
    description: "My personal developer portfolio, built as an interactive digital identity to present my skills, journey, featured work, and contact flow with cinematic motion and clean responsive design.",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=1200",
    liquidVideo: "https://www.w3schools.com/html/mov_bbb.mp4",
    tags: ["Personal Portfolio", "React", "GSAP"],
    link: ""
  }
];

/**
 * PinnedProjectsSection
 * ──────────────────────────────────────────────────────────────
 * - Full-screen height section with pinning.
 * - Minimal, cinematic aesthetic (White/Cream).
 * - Manual scroll between project showcases.
 */
const PinnedProjectsSection = () => {
  const triggerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
  ));

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const handleMediaChange = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  useEffect(() => {
    projects.forEach((project) => {
      const image = new Image();
      image.decoding = 'async';
      image.src = project.image;
      preloadLiquidProjectTexture(project.image);
    });
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

      <section className={`relative w-full ${isMobile ? 'h-auto overflow-visible' : 'h-screen overflow-hidden'}`}>
        {/* Navigation / Progress Sidebar */}
        {!isMobile && (
          <div className="projects-progress absolute top-1/2 -translate-y-1/2 z-50 flex flex-col gap-6">
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

        {/* Project Rendering */}
        <div className="relative w-full h-full">
          {isMobile ? (
            // Mobile: Stacked layout
            <div className="flex flex-col divide-y divide-black/5">
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

      </section>
    </div>
  );
};

export default PinnedProjectsSection;

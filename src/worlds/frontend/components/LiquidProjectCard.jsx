import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import LiquidProjectImage from './LiquidProjectImage';

const LiquidProjectCard = ({ title, description, image, tags, link, isActive, isMobile }) => {
  const cardRef = useRef(null);
  const titleRef = useRef(null);
  const infoRef = useRef(null);
  const visualRef = useRef(null);

  useEffect(() => {
    if (isMobile) return;

    if (isActive) {
      gsap.to(cardRef.current, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.8,
        ease: 'power2.inOut',
      });

      gsap.fromTo(
        titleRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2, ease: 'expo.out', delay: 0.1 },
      );

      gsap.fromTo(
        infoRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2, ease: 'expo.out', delay: 0.2 },
      );

      gsap.fromTo(
        visualRef.current,
        { scale: 0.8, opacity: 0, rotate: -2 },
        { scale: 1, opacity: 1, rotate: 0, duration: 1.5, ease: 'expo.out' },
      );
    } else {
      gsap.to(cardRef.current, {
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.5,
        ease: 'power2.inOut',
      });
    }
  }, [isActive, isMobile]);

  return (
    <div
      ref={cardRef}
      className={`
        ${isMobile ? 'relative w-full flex flex-col gap-12 py-20 px-6' : 'absolute inset-0 w-full h-full flex items-center justify-between px-12 md:px-20 lg:px-32'}
        bg-[#fcfaf7]
      `}
      style={{ opacity: isMobile ? 1 : 0 }}
    >
      <div ref={titleRef} className="w-full md:w-[30%] flex flex-col justify-center z-20">
        <div className="overflow-hidden">
          <h2 className="text-[clamp(3rem,8vw,6rem)] font-serif font-medium leading-[0.9] tracking-tight text-[#1a1a1a] uppercase">
            {title}
          </h2>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span key={i} className="text-[10px] tracking-widest uppercase font-bold text-[#1a1a1a]/40">
              {tag}
              {i < tags.length - 1 ? ' - ' : ''}
            </span>
          ))}
        </div>
      </div>

      <div
        ref={visualRef}
        className="w-full md:w-[40%] aspect-[3/4] md:aspect-[4/5] relative z-10 flex items-center justify-center group"
      >
        <LiquidProjectImage
          src={image}
          alt={title}
          isInteractive={isActive && !isMobile}
          className="w-full h-full cursor-pointer"
        />
      </div>

      <div ref={infoRef} className="w-full md:w-[25%] flex flex-col gap-8 justify-center z-20">
        <div className="w-12 h-[1px] bg-[#1a1a1a] mb-2" />
        <p className="text-sm md:text-base leading-relaxed text-[#1a1a1a]/80 font-light max-w-[280px]">
          {description}
        </p>
        {link && <div className="flex mt-4">
          <a
            href={link}
            target={link.startsWith('http') ? '_blank' : undefined}
            rel={link.startsWith('http') ? 'noreferrer' : undefined}
            className="group relative flex items-center gap-4 text-[11px] font-bold tracking-[0.3em] uppercase text-[#1a1a1a]"
          >
            <span className="relative z-10">Explore Case</span>
            <div className="relative w-8 h-8 flex items-center justify-center border border-[#1a1a1a]/10 rounded-full transition-all duration-500 group-hover:scale-125 group-hover:bg-[#1a1a1a] group-hover:text-white">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </div>
          </a>
        </div>}
      </div>

      {!isMobile && (
        <div className="absolute bottom-12 left-12 text-[10px] font-bold tracking-[0.5em] text-[#1a1a1a]/20 uppercase">
          Innovation &amp; Design / 2024
        </div>
      )}
    </div>
  );
};

export default LiquidProjectCard;

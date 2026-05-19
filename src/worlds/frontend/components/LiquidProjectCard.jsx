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
        duration: 0.25,
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
        { scale: 0.98, opacity: 1, rotate: 0 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.35, ease: 'power2.out' },
      );
    } else {
      gsap.to(cardRef.current, {
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.2,
        ease: 'power2.inOut',
      });
    }
  }, [isActive, isMobile]);

  return (
    <div
      ref={cardRef}
      className={`
        ${isMobile ? 'relative flex w-full flex-col gap-8 px-5 py-16 sm:px-8 sm:py-20' : 'absolute inset-0 w-full h-full flex items-center justify-between gap-8 px-10 md:px-14 lg:px-32'}
        bg-[#fcfaf7]
      `}
      style={{ opacity: isMobile || isActive ? 1 : 0 }}
    >
      <div ref={titleRef} className="z-20 flex w-full flex-col justify-center md:w-[30%] lg:w-[32%]">
        <div className="overflow-hidden">
          <h2 className="max-w-full whitespace-pre-line break-words font-serif text-[clamp(2.7rem,14vw,5rem)] font-medium uppercase leading-[0.92] tracking-tight text-[#1a1a1a] md:text-[clamp(2.5rem,5.2vw,4.7rem)] lg:text-[clamp(3rem,6vw,5rem)]">
            {title}
          </h2>
        </div>
        <div className="mt-5 flex flex-wrap gap-2 sm:mt-6">
          {tags.map((tag, i) => (
            <span key={i} className="text-[9px] font-bold uppercase tracking-widest text-[#1a1a1a]/40 sm:text-[10px]">
              {tag}
              {i < tags.length - 1 ? ' - ' : ''}
            </span>
          ))}
        </div>
      </div>

      <div
        ref={visualRef}
        className="group relative z-10 flex aspect-[4/5] w-full items-center justify-center sm:aspect-[16/13] md:aspect-[3/4] md:w-[36%] lg:aspect-[4/5] lg:w-[38%]"
      >
        <LiquidProjectImage
          src={image}
          alt={title}
          isInteractive={!isMobile}
          effectEnabled={isActive && !isMobile}
          className="w-full h-full cursor-pointer"
        />
      </div>

      <div ref={infoRef} className="z-20 flex w-full flex-col justify-center gap-6 md:w-[28%] md:gap-7 lg:w-[25%] lg:gap-8">
        <div className="mb-1 h-[1px] w-12 bg-[#1a1a1a] md:mb-2" />
        <p className="max-w-xl text-sm font-light leading-7 text-[#1a1a1a]/80 md:max-w-[260px] md:text-sm md:leading-7 lg:max-w-[280px] lg:text-base lg:leading-relaxed">
          {description}
        </p>
        {link && (
          <div className="mt-2 flex md:mt-4">
            <a
              href={link}
              target={link.startsWith('http') ? '_blank' : undefined}
              rel={link.startsWith('http') ? 'noreferrer' : undefined}
              className="group relative flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.24em] text-[#1a1a1a] sm:text-[11px] sm:tracking-[0.3em]"
            >
              <span className="relative z-10">Explore Case</span>
              <div className="relative w-8 h-8 flex items-center justify-center border border-[#1a1a1a]/10 rounded-full transition-all duration-500 group-hover:scale-125 group-hover:bg-[#1a1a1a] group-hover:text-white">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </div>
            </a>
          </div>
        )}
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

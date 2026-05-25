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
        ${isMobile ? 'project-card project-card--mobile relative w-full' : 'project-card project-card--desktop absolute inset-0 h-full w-full'}
      `}
      style={{ opacity: isMobile ? 1 : 0 }}
    >
      <div className={isMobile ? 'project-card__inner project-card__inner--mobile' : 'project-card__inner project-card__inner--desktop'}>
        <div ref={titleRef} className="project-card__title z-20 flex flex-col justify-center">
          <div className="overflow-hidden">
            <h2 className="project-card__title-text font-serif font-medium leading-[0.9] tracking-tight text-[#1a1a1a] uppercase">
              {title}
            </h2>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <span key={i} className="text-[10px] tracking-widest uppercase font-bold text-[#1a1a1a]/40 md:text-xs">
                {tag}
                {i < tags.length - 1 ? ' - ' : ''}
              </span>
            ))}
          </div>
        </div>

        <div
          ref={visualRef}
          className="project-card__media relative z-10 flex items-center justify-center group"
        >
          <LiquidProjectImage
            src={image}
            alt={title}
            isInteractive={!isMobile}
            effectEnabled={isActive && !isMobile}
            className="w-full h-full cursor-pointer"
          />
        </div>

        <div ref={infoRef} className="project-card__info z-20 flex flex-col gap-8 justify-center">
          <div className="w-12 h-[1px] bg-[#1a1a1a] mb-2" />
          <p className="project-card__copy text-[#1a1a1a]/80 font-light">
            {description}
          </p>
          {link && <div className="flex mt-4">
            <a
              href={link}
              target={link.startsWith('http') ? '_blank' : undefined}
              rel={link.startsWith('http') ? 'noreferrer' : undefined}
              className="project-card__cta group relative flex items-center gap-4 font-bold tracking-[0.3em] uppercase text-[#1a1a1a]"
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
      </div>
    </div>
  );
};

export default LiquidProjectCard;

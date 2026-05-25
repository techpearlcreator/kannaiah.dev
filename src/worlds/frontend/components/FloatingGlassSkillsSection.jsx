import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const skillData = [
  { name: 'HTML', level: 'Used with AI', size: 'md', x: -38, y: -30, type: 'FRONTEND' },
  { name: 'CSS', level: 'Used with AI', size: 'sm', x: -40, y: -5, type: 'FRONTEND' },
  { name: 'JavaScript', level: 'Learning', size: 'lg', x: -31, y: 24, type: 'LANGUAGE' },
  { name: 'React', level: 'Used with AI', size: 'lg', x: 34, y: -25, type: 'FRAMEWORK' },
  { name: 'Deployment', level: 'Basic use', size: 'sm', x: 39, y: 2, type: 'DEVOPS' },
  { name: 'Three.js', level: 'Exploring', size: 'sm', x: 28, y: 31, type: 'LIBRARY' },
  { name: 'Node.js', level: 'Learning', size: 'md', x: -21, y: -38, type: 'BACKEND' },
  { name: 'Express', level: 'Exploring', size: 'sm', x: 2, y: -40, type: 'FRAMEWORK' },
  { name: 'MongoDB', level: 'Exploring', size: 'sm', x: 23, y: -39, type: 'DATABASE' },
  { name: 'Firebase', level: 'Basic use', size: 'md', x: -18, y: 39, type: 'BACKEND' },
  { name: 'Flutter', level: 'Exploring', size: 'lg', x: 5, y: 38, type: 'FRAMEWORK' },
  { name: 'Dart', level: 'Exploring', size: 'sm', x: 26, y: 12, type: 'LANGUAGE' },
  { name: 'GitHub', level: 'Basic use', size: 'md', x: -26, y: -15, type: 'TOOL' },
  { name: 'UI/UX', level: 'Practicing', size: 'lg', x: 42, y: 20, type: 'DESIGN' },
  { name: 'AI Tools', level: 'Daily use', size: 'md', x: 18, y: -15, type: 'TOOLS' },
];

const sizeMap = {
  lg: 'skill-card skill-card--lg',
  md: 'skill-card skill-card--md',
  sm: 'skill-card skill-card--sm',
};

const FloatingGlassSkillsSection = () => {
  const containerRef = useRef(null);
  const brandingRef = useRef(null);
  const cardsRef = useRef([]);
  const glowRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(max-width: 1024px)').matches
  ));

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1024px)');
    const handleMediaChange = (event) => setIsMobile(event.matches);
    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  useEffect(() => {
    if (isMobile) return undefined;

    const cards = cardsRef.current.filter(Boolean);
    const container = containerRef.current;

    gsap.set(cards, { opacity: 0, scale: 0.7 });
    gsap.set(brandingRef.current, { opacity: 0, y: 24 });

    const reveal = ScrollTrigger.create({
      trigger: container,
      start: 'top 65%',
      once: true,
      onEnter: () => {
        gsap.to(brandingRef.current, {
          opacity: 1,
          y: 0,
          duration: 1.6,
          ease: 'expo.out',
        });
        gsap.to(cards, {
          opacity: 1,
          scale: 1,
          duration: 1.4,
          stagger: { each: 0.06, from: 'center' },
          ease: 'expo.out',
        });
      },
    });

    const floatTweens = cards.map((card, index) => {
      const yAmt = 7 + (index % 3) * 3;
      const xAmt = 3 + (index % 4);
      const rot = index % 2 === 0 ? 2.5 : -2.5;

      return gsap.to(card, {
        y: `+=${yAmt}`,
        x: `+=${xAmt}`,
        rotation: rot,
        duration: 3.5 + (index % 5) * 0.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.18,
      });
    });

    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;

      if (glowRef.current) {
        gsap.to(glowRef.current, {
          x: clientX,
          y: clientY,
          duration: 0.9,
          ease: 'power2.out',
        });
      }

      const xRatio = clientX / window.innerWidth - 0.5;
      const yRatio = clientY / window.innerHeight - 0.5;

      cards.forEach((card, index) => {
        const depth = (index % 4 + 1) * 2.5;
        gsap.to(card, {
          xPercent: xRatio * depth,
          yPercent: yRatio * depth,
          duration: 1.2,
          ease: 'power1.out',
          overwrite: 'auto',
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      reveal.kill();
      floatTweens.forEach((tween) => tween.kill());
    };
  }, [isMobile]);

  if (isMobile) {
    return (
      <section className="skills-section relative flex w-full flex-col items-center bg-[#fdfaf5]">
        <div className="mb-12 text-center sm:mb-16">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.32em] text-black/20 sm:tracking-[0.6em]">
            Vibe Code Toolkit
          </p>
          <h1 className="mb-4 text-[clamp(2.5rem,12vw,4.2rem)] font-black leading-none tracking-tighter">
            VIBE CODE
            <br />
            <span className="font-serif font-normal italic text-[#7B61FF]">
              DEVELOPER
            </span>
          </h1>
          <p className="skills-mobile-copy mx-auto leading-7 opacity-60">
            These are the tools I use with AI while building projects. I am still improving my manual coding knowledge, but I understand how to guide, edit, and shape AI-generated code into working experiences.
          </p>
        </div>

        <div className="skills-mobile-grid w-full">
          {skillData.map((skill) => (
            <div key={skill.name} className="skills-mobile-card flex flex-col items-center justify-center rounded-2xl border border-black/5 bg-white text-center shadow-sm">
              <span className="mb-2 text-sm font-bold leading-tight text-black/70 sm:text-base">{skill.name}</span>
              <span className="max-w-full rounded-full bg-black/5 px-2 py-1 text-[8px] uppercase leading-none tracking-[0.14em] text-black/50 sm:tracking-[0.2em]">{skill.level}</span>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="skills-section relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fdfaf5]"
      style={{ isolation: 'isolate' }}
    >
      <div
        className="pointer-events-none absolute left-1/4 top-1/4 h-[600px] w-[600px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(123,97,255,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />
      <div
        className="pointer-events-none absolute bottom-1/4 right-1/4 h-[700px] w-[700px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(200,100,255,0.05) 0%, transparent 70%)', filter: 'blur(80px)' }}
      />

      <div
        ref={brandingRef}
        className="skills-branding pointer-events-none relative z-20 select-none text-center"
      >
        <p className="mb-8 text-[10px] font-bold uppercase tracking-[0.6em] text-black/20">
          Vibe Code Toolkit
        </p>
        <h1 className="skills-title mb-5 font-black leading-[0.92] tracking-tighter">
          VIBE CODE
          <br />
          <span className="font-serif font-normal italic text-[#7B61FF]">
            DEVELOPER
          </span>
        </h1>
        <p className="mb-5 text-lg font-medium leading-snug tracking-tight opacity-60 md:text-2xl">
          Tools I use while building with AI.
        </p>
        <p className="mx-auto max-w-2xl text-sm font-medium leading-7 opacity-40 md:text-lg md:leading-8">
          I use these skills in vibe-code development, where AI helps generate the code and I guide the idea, design, prompts, fixes, and final output. I am still learning the deeper manual coding side, so this section shows practical usage and growth, not full expert-level mastery.
        </p>
      </div>

      <div className="pointer-events-none absolute inset-0 z-10">
        {skillData.map((skill, index) => (
          <div
            key={skill.name}
            ref={(element) => { cardsRef.current[index] = element; }}
            className="group pointer-events-auto absolute left-1/2 top-1/2"
            data-cursor-type="skill"
            data-cursor-text={skill.type}
            style={{
              transform: `translate(calc(-50% + clamp(-34rem, ${skill.x}vw, 34rem)), calc(-50% + clamp(-21rem, ${skill.y}vh, 21rem)))`,
            }}
          >
            <div
              className={`
                relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-3xl px-3 text-center
                border border-white/40 bg-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.06)]
                backdrop-blur-2xl transition-all duration-500 ease-out
                hover:-translate-y-2 hover:scale-[1.04] hover:border-[rgba(123,97,255,0.3)]
                hover:bg-white/50 hover:shadow-[0_12px_48px_rgba(123,97,255,0.15)]
                ${sizeMap[skill.size]}
              `}
            >
              <span className="font-bold leading-tight tracking-tight text-black/60 transition-colors duration-500 group-hover:text-black/85">
                {skill.name}
              </span>

              <span className="skill-level max-w-full rounded-full bg-black/6 px-2.5 py-1 font-black uppercase leading-none tracking-[0.18em] text-black/46 transition duration-300 group-hover:bg-black group-hover:text-white">
                {skill.level}
              </span>

              <div
                className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: 'linear-gradient(135deg, rgba(123,97,255,0.08) 0%, transparent 60%)' }}
              />
            </div>
          </div>
        ))}
      </div>

      <div
        ref={glowRef}
        className="pointer-events-none fixed left-0 top-0"
        style={{
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(123,97,255,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
          transform: 'translate(-50%,-50%)',
          zIndex: 1,
          mixBlendMode: 'normal',
        }}
      />
    </section>
  );
};

export default FloatingGlassSkillsSection;

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stages = [
  {
    phase: 'Foundation',
    title: 'I started with structure.',
    body: 'My journey began with simple pages. HTML and CSS helped me understand how an idea becomes something visible on a screen.',
    tags: ['HTML', 'CSS'],
    cursor: 'START',
  },
  {
    phase: 'Interaction',
    title: 'Then I learned how pages respond.',
    body: 'JavaScript taught me how to add logic, movement, and small interactions that make a website feel alive.',
    tags: ['JavaScript', 'UI/UX'],
    cursor: 'FRONTEND',
  },
  {
    phase: 'Interface',
    title: 'I started building real interfaces.',
    body: 'React changed how I think about building. I began to see pages as reusable parts, connected states, and smoother user experiences.',
    tags: ['React', 'Three.js'],
    cursor: 'REACT',
  },
  {
    phase: 'Systems',
    title: 'I wanted to understand what happens behind the screen.',
    body: 'Backend learning helped me explore APIs, databases, authentication, and the flow that supports a complete project.',
    tags: ['Node.js', 'Express', 'MongoDB'],
    cursor: 'BACKEND',
  },
  {
    phase: 'Shipping',
    title: 'Then I learned to share my work.',
    body: 'GitHub and deployment taught me that a project matters more when it can be tested, improved, and opened by real people.',
    tags: ['GitHub', 'Deployment'],
    cursor: 'PRODUCT',
  },
  {
    phase: 'Next Chapter',
    title: 'Now I am exploring intelligent products.',
    body: 'I am learning how AI tools can support better workflows, smarter interfaces, and more useful digital experiences.',
    tags: ['AI Tools', 'Automation'],
    cursor: 'AI',
  },
];

const FloatingJourneyCardCloud = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const lineRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        },
      );

      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 55%',
            end: 'bottom 65%',
            scrub: true,
          },
        },
      );

      itemRefs.current.filter(Boolean).forEach((item) => {
        const level = item.querySelector('.timeline-level');
        const shell = item.querySelector('.timeline-shell');
        const content = item.querySelector('.timeline-content');
        const lines = item.querySelectorAll('.timeline-build-line');
        const dot = item.querySelector('.timeline-dot');

        gsap.set(item, { opacity: 1 });
        gsap.set(shell, { backgroundColor: 'rgba(255,255,255,0.42)' });
        gsap.set(level, { opacity: 0, y: 10 });
        gsap.set(content, { opacity: 0, y: 18 });
        gsap.set(dot, { scale: 0 });
        gsap.set(lines[0], { scaleX: 0, transformOrigin: 'left center' });
        gsap.set(lines[1], { scaleY: 0, transformOrigin: 'center top' });
        gsap.set(lines[2], { scaleX: 0, transformOrigin: 'right center' });
        gsap.set(lines[3], { scaleY: 0, transformOrigin: 'center bottom' });

        gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 78%',
            once: true,
          },
        })
          .to(dot, {
            scale: 1,
            duration: 0.35,
            ease: 'back.out(2)',
          }, 0)
          .to(level, {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: 'power3.out',
          }, 0.05)
          .to(shell, {
            backgroundColor: 'rgba(255,255,255,0.74)',
            duration: 0.55,
            ease: 'power2.out',
          }, 0.1)
          .to(lines[0], {
            scaleX: 1,
            duration: 0.38,
            ease: 'power2.inOut',
          }, 0.16)
          .to(lines[1], {
            scaleY: 1,
            duration: 0.32,
            ease: 'power2.inOut',
          }, 0.48)
          .to(lines[2], {
            scaleX: 1,
            duration: 0.38,
            ease: 'power2.inOut',
          }, 0.72)
          .to(lines[3], {
            scaleY: 1,
            duration: 0.32,
            ease: 'power2.inOut',
          }, 1.04)
          .to(content, {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power3.out',
          }, 0.72);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="journey-section"
      className="journey-section relative overflow-hidden bg-[#f9fafb]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-32 select-none text-center text-[clamp(4.5rem,13vw,11rem)] font-black uppercase leading-[0.95] tracking-tight text-[#111827]/[0.035]">
        <span className="block">Developer</span>
        <span className="block">Journey</span>
      </div>

      <div ref={titleRef} className="journey-heading relative z-10 mx-auto mb-24 text-center">
        <p className="mb-4 text-[10px] font-black uppercase tracking-[0.55em] text-[#111827]/25">
          How my journey started
        </p>
        <h2 className="journey-title mx-auto flex flex-wrap items-baseline justify-center gap-x-5 gap-y-1 font-black uppercase leading-[0.9] tracking-tight text-[#111827]">
          <span>Developer</span>
          <span className="font-serif font-normal italic normal-case text-[#7C3AED]">
            Journey
          </span>
        </h2>
        <p className="journey-copy mx-auto mt-7 text-[#111827]/55">
          This is not a resume. It is the story of how curiosity turned into practice, and how practice slowly became real project work.
        </p>
      </div>

      <div className="journey-list relative z-10 mx-auto">
        <div className="absolute left-4 top-0 h-full w-px bg-[#111827]/10 md:left-1/2 md:-translate-x-1/2">
          <div
            ref={lineRef}
            className="h-full origin-top bg-[#7C3AED]"
            style={{ transform: 'scaleY(0)' }}
          />
        </div>

        <div className="flex flex-col gap-16 md:gap-24 xl:gap-28">
          {stages.map((stage, index) => (
            <TimelineItem
              key={stage.phase}
              stage={stage}
              index={index}
              refCallback={(element) => { itemRefs.current[index] = element; }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const TimelineItem = ({ stage, index, refCallback }) => {
  const isLeft = index % 2 === 0;

  return (
    <article
      ref={refCallback}
      data-cursor-type="skill"
      data-cursor-text={stage.cursor}
      className={`relative grid gap-6 pl-12 md:grid-cols-2 md:items-start md:gap-16 xl:gap-24 md:pl-0 ${isLeft ? '' : ''}`}
    >
      <div
        className={`
          timeline-shell relative overflow-hidden rounded-2xl bg-white/70 shadow-[0_18px_55px_rgba(17,24,39,0.06)]
          backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-[#7C3AED]/35
          hover:shadow-[0_24px_70px_rgba(124,58,237,0.12)]
          ${isLeft ? 'md:col-start-1 md:text-right' : 'md:col-start-2 md:text-left'}
        `}
      >
        <span className="timeline-build-line absolute left-0 top-0 h-px w-full bg-[#7C3AED]/70" />
        <span className="timeline-build-line absolute right-0 top-0 h-full w-px origin-top bg-[#7C3AED]/70" />
        <span className="timeline-build-line absolute bottom-0 right-0 h-px w-full origin-right bg-[#7C3AED]/70" />
        <span className="timeline-build-line absolute bottom-0 left-0 h-full w-px origin-bottom bg-[#7C3AED]/70" />

        <div className={`timeline-level mb-5 flex items-center gap-3 ${isLeft ? 'md:justify-end' : ''}`}>
          <span className="rounded-full bg-[#7C3AED]/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.3em] text-[#7C3AED]">
            LVL-0{index + 1}
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#111827]/35 md:text-xs">
            {stage.phase}
          </span>
        </div>

        <div className="timeline-content">
          <h3 className="timeline-title font-black leading-tight tracking-tight text-[#111827]">
            {stage.title}
          </h3>
          <p className="timeline-copy mt-4 text-[#111827]/58">
            {stage.body}
          </p>
          <div className={`mt-6 flex flex-wrap gap-2 ${isLeft ? 'md:justify-end' : ''}`}>
            {stage.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#111827]/5 bg-[#111827]/[0.035] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#111827]/55 md:text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="timeline-dot absolute left-4 top-7 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-[#f9fafb] bg-[#7C3AED] shadow-[0_0_18px_rgba(124,58,237,0.42)] md:left-1/2" />
    </article>
  );
};

export default FloatingJourneyCardCloud;

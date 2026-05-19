import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const cursorStyles = {
  default: {
    size: 42,
    border: 'rgba(255,255,255,0.72)',
    background: 'rgba(255,255,255,0.08)',
    shadow: '0 0 22px rgba(255,255,255,0.22)',
  },
  button: {
    size: 64,
    border: 'rgba(255,255,255,0.82)',
    background: 'rgba(255,255,255,0.12)',
    shadow: '0 0 30px rgba(255,255,255,0.28)',
    blur: 'blur(10px)',
  },
  lens: {
    size: 58,
    border: 'rgba(255,255,255,0.92)',
    background: 'rgba(255,255,255,0.03)',
    shadow: '0 0 0 1px rgba(255,255,255,0.12), 0 0 26px rgba(255,255,255,0.24)',
    blur: 'none',
  },
  image: {
    size: 78,
    border: 'rgba(255,255,255,0.86)',
    background: 'rgba(255,255,255,0.16)',
    shadow: '0 0 36px rgba(255,255,255,0.28)',
    blur: 'blur(10px)',
  },
  skill: {
    size: 78,
    border: 'rgba(255,255,255,0.9)',
    background: 'rgba(255,255,255,0.08)',
    shadow: '0 0 40px rgba(123,97,255,0.28)',
    blur: 'none',
  },
  contact: {
    size: 36,
    border: 'rgba(255,255,255,0.7)',
    background: 'rgba(255,255,255,0.02)',
    shadow: '0 0 18px rgba(255,255,255,0.16)',
    blur: 'none',
  },
};

const getCursorType = (target) => (
  target.closest('[data-cursor-type]')?.getAttribute('data-cursor-type')
  || (target.tagName === 'A' || target.tagName === 'BUTTON' ? 'button' : 'default')
);

const AdaptiveCursor = () => {
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const labelRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const frameRef = useRef(null);
  const shockwaveId = useRef(0);
  const [visible, setVisible] = useState(false);
  const [cursorType, setCursorType] = useState('default');
  const [cursorText, setCursorText] = useState('');
  const [shockwaves, setShockwaves] = useState([]);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return undefined;

    const syncCursorStyle = (type) => {
      const style = cursorStyles[type] || cursorStyles.default;
      gsap.to(ringRef.current, {
        width: style.size,
        height: style.size,
        borderColor: style.border,
        backgroundColor: style.background,
        boxShadow: style.shadow,
        backdropFilter: style.blur || 'blur(10px)',
        webkitBackdropFilter: style.blur || 'blur(10px)',
        duration: 0.28,
        ease: 'power3.out',
      });
      gsap.to(dotRef.current, {
        scale: type === 'skill' || type === 'lens' || type === 'contact' ? 0 : 1,
        opacity: type === 'skill' || type === 'lens' || type === 'contact' ? 0 : 1,
        duration: 0.2,
        ease: 'power2.out',
      });
      gsap.to(labelRef.current, {
        opacity: type === 'skill' ? 1 : 0,
        scale: type === 'skill' ? 1 : 0.92,
        duration: 0.18,
        ease: 'power2.out',
      });
    };

    const handleMouseMove = (event) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;
      setVisible(true);

      const target = event.target;
      const nextType = getCursorType(target);
      const nextText = target.closest('[data-cursor-text]')?.getAttribute('data-cursor-text') || '';

      setCursorType(nextType);
      setCursorText(nextText);
      syncCursorStyle(nextType);
    };

    const handleMouseDown = () => {
      const id = shockwaveId.current++;
      setShockwaves((items) => [...items, { id, x: mouse.current.x, y: mouse.current.y }]);
      setTimeout(() => {
        setShockwaves((items) => items.filter((item) => item.id !== id));
      }, 780);

      gsap.fromTo(
        ringRef.current,
        { scale: 0.86 },
        { scale: 1, duration: 0.35, ease: 'elastic.out(1, 0.55)' },
      );
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    const tick = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.18;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.18;

      gsap.set(dotRef.current, { x: mouse.current.x, y: mouse.current.y });
      gsap.set(ringRef.current, { x: ring.current.x, y: ring.current.y });

      frameRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    frameRef.current = requestAnimationFrame(tick);
    syncCursorStyle('default');

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div className={`pointer-events-none fixed inset-0 z-[9999] transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div
        ref={ringRef}
        className="absolute left-0 top-0 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur-md"
        style={{ width: 42, height: 42 }}
      >
        <span
          ref={labelRef}
          className="px-2 text-center text-[9px] font-black uppercase tracking-[0.18em] text-[#7B61FF] opacity-0"
        >
          {cursorText}
        </span>
        {cursorType === 'image' && (
          <span className="absolute inset-2 rounded-full border border-white/20" />
        )}
        {cursorType === 'lens' && (
          <span className="absolute inset-2 rounded-full border border-white/30 shadow-[inset_0_0_18px_rgba(255,255,255,0.16)]" />
        )}
      </div>

      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_16px_rgba(255,255,255,0.9)]"
      />

      {shockwaves.map((wave) => (
        <div
          key={wave.id}
          className="absolute left-0 top-0 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/85 shadow-[0_0_28px_rgba(255,255,255,0.32)] animate-cursor-shockwave"
          style={{ left: wave.x, top: wave.y }}
        />
      ))}
    </div>
  );
};

export default AdaptiveCursor;

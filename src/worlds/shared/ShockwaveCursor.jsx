import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * ShockwaveCursor
 * ──────────────────────────────────────────────────────────────
 * Premium cinematic cursor with elastic shockwaves, lerped motion,
 * velocity stretching, and contextual hover interactions.
 */
const ShockwaveCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const textRef = useRef(null);
  const requestRef = useRef(null);

  // Use a ref for ripples to avoid frequent re-renders for every single click if possible,
  // but for React rendering we need state. To maintain high performance, we will map them via state.
  const [ripples, setRipples] = useState([]);
  const rippleCount = useRef(0);

  // Mouse tracking state
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const lastMouse = useRef({ x: 0, y: 0 });
  
  // Hover states
  const [cursorText, setCursorText] = useState("");
  const isHovering = useRef(false);

  // Detect touch devices to disable cursor
  const isTouchDevice = useMemo(() => (
    typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches
  ), []);

  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      // Instantly move the dot
      if (dotRef.current) {
        gsap.set(dotRef.current, { x: e.clientX, y: e.clientY });
      }
    };

    const spawnRipple = (x, y, scale = 1, isMini = false) => {
      const id = rippleCount.current++;
      const newRipple = { id, x, y, scale, isMini };
      setRipples((prev) => [...prev, newRipple]);

      // Remove ripple after animation finishes (approx 1s)
      setTimeout(() => {
        setRipples((prev) => prev.filter(r => r.id !== id));
      }, 1000);
    };

    const handleMouseDown = (e) => {
      spawnRipple(e.clientX, e.clientY, 1, false);
      // Slight ring pinch on click
      if (ringRef.current) {
        gsap.to(ringRef.current, { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 });
      }
    };

    // Contextual hovers via event delegation
    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-cursor-type], a, button');
      if (target) {
        isHovering.current = true;
        const type = target.getAttribute('data-cursor-type') || target.tagName.toLowerCase();
        
        let text = target.getAttribute('data-cursor-text');
        if (!text) {
          if (type === "project") text = "VIEW";
          else if (type === "contact" || target.tagName === "A" && target.href.includes("mailto")) text = "CONNECT";
          else if (type === "skill") text = "EXPLORE";
          else if (target.tagName === "BUTTON") text = "OPEN";
        }

        if (text) setCursorText(text);

        // Hover animations
        if (ringRef.current) {
          gsap.to(ringRef.current, { 
            width: 80, height: 80, 
            backgroundColor: "rgba(255,255,255,0.08)",
            borderColor: "rgba(255,255,255,0.35)",
            duration: 0.4, ease: "power2.out" 
          });
        }
        if (dotRef.current) {
          gsap.to(dotRef.current, { opacity: 0, duration: 0.2 });
        }
        
        // Mini ripple on hover enter
        spawnRipple(mouse.current.x, mouse.current.y, 0.5, true);
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest('[data-cursor-type], a, button');
      if (target) {
        isHovering.current = false;
        setCursorText("");
        
        if (ringRef.current) {
          gsap.to(ringRef.current, { 
            width: 40, height: 40, 
            backgroundColor: "transparent",
            borderColor: "rgba(255,255,255,0.2)",
            duration: 0.4, ease: "power2.out" 
          });
        }
        if (dotRef.current) {
          gsap.to(dotRef.current, { opacity: 1, duration: 0.2 });
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    // Render loop for smooth lerp and velocity stretch
    const render = () => {
      if (!isHovering.current && ringRef.current) {
        // Lerp factor
        const lerpAmt = 0.15;
        ring.current.x += (mouse.current.x - ring.current.x) * lerpAmt;
        ring.current.y += (mouse.current.y - ring.current.y) * lerpAmt;

        // Calculate velocity
        const dx = mouse.current.x - lastMouse.current.x;
        const dy = mouse.current.y - lastMouse.current.y;
        const velocity = Math.sqrt(dx * dx + dy * dy);
        
        // Stretch based on velocity
        const scaleX = Math.min(1 + velocity * 0.005, 1.5);
        const scaleY = Math.max(1 - velocity * 0.002, 0.8);
        
        // Calculate angle
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        gsap.set(ringRef.current, {
          x: ring.current.x,
          y: ring.current.y,
          rotation: velocity > 2 ? angle : 0,
          scaleX: scaleX,
          scaleY: scaleY,
        });

        lastMouse.current.x = ring.current.x;
        lastMouse.current.y = ring.current.y;
      } else if (isHovering.current && ringRef.current) {
        // Snappier lerp when hovering
        ring.current.x += (mouse.current.x - ring.current.x) * 0.3;
        ring.current.y += (mouse.current.y - ring.current.y) * 0.3;
        
        gsap.set(ringRef.current, {
          x: ring.current.x,
          y: ring.current.y,
          rotation: 0,
          scaleX: 1,
          scaleY: 1
        });
      }

      requestRef.current = requestAnimationFrame(render);
    };
    
    requestRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(requestRef.current);
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      
      {/* Small Center Dot */}
      <div 
        ref={dotRef}
        className="absolute top-0 left-0 w-2 h-2 bg-white rounded-full mix-blend-difference -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
      />

      {/* Soft Glowing Outer Ring */}
      <div 
        ref={ringRef}
        className="absolute top-0 left-0 w-10 h-10 border border-white/20 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2 backdrop-blur-[2px] transition-colors shadow-[0_0_15px_rgba(255,255,255,0.12)]"
      >
        {/* Cursor Text */}
        <span 
          ref={textRef}
          className={`text-[8px] tracking-[0.2em] font-bold text-white uppercase transition-opacity duration-300 ${cursorText ? 'opacity-100' : 'opacity-0'}`}
        >
          {cursorText}
        </span>
      </div>

      {/* Shockwave Ripples */}
      {ripples.map(ripple => (
        <Ripple key={ripple.id} x={ripple.x} y={ripple.y} scale={ripple.scale} isMini={ripple.isMini} />
      ))}
      
    </div>
  );
};

// Internal component for an individual shockwave
const Ripple = ({ x, y, scale, isMini }) => {
  const rippleRef = useRef(null);

  useEffect(() => {
    if (rippleRef.current) {
      gsap.fromTo(rippleRef.current,
        { scale: 0.5, opacity: isMini ? 0.4 : 0.8 },
        { 
          scale: (isMini ? 1.5 : 3) * scale, 
          opacity: 0, 
          duration: isMini ? 0.6 : 1, 
          ease: "expo.out" 
        }
      );
    }
  }, [scale, isMini]);

  return (
    <div 
      ref={rippleRef}
      className={`absolute top-0 left-0 rounded-full border border-white/35 -translate-x-1/2 -translate-y-1/2 pointer-events-none ${isMini ? 'w-16 h-16 shadow-[0_0_20px_rgba(255,255,255,0.16)]' : 'w-24 h-24 shadow-[0_0_40px_rgba(255,255,255,0.22)]'}`}
      style={{ left: x, top: y, filter: 'blur(1px)' }}
    />
  );
};

export default ShockwaveCursor;

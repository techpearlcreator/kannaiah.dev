import React, { useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import LiquidImageShader from './LiquidImageShader';

/**
 * ProjectLiquidCard
 * ──────────────────────────────────────────────────────────────
 * Premium Glassmorphism Card with WebGL Liquid Hover.
 */

const ProjectLiquidCard = ({ title, description, tags, imageUrl, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Normalize coordinates to 0-1 for the shader
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1.0 - (e.clientY - rect.top) / rect.height; // Flip Y for WebGL
    
    setMousePos({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0.5, y: 0.5 });
      }}
      className="group relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-white/5 border border-white/10 shadow-2xl transition-all duration-700 hover:shadow-[0_40px_80px_rgba(0,0,0,0.2)] hover:border-white/20"
      style={{ perspective: '1200px' }}
    >
      {/* ── WebGL Liquid Background ─────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 2]}>
          <Suspense fallback={null}>
            <LiquidImageShader 
              imageUrl={imageUrl} 
              isHovered={isHovered} 
              mousePos={mousePos} 
            />
          </Suspense>
        </Canvas>
      </div>

      {/* ── Glass Overlay ───────────────────────────────────────────── */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />
      
      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-20 p-8 md:p-10 flex flex-col justify-end">
        <motion.div
          animate={isHovered ? { y: -10 } : { y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex gap-2 mb-4">
             {tags.map((tag, i) => (
               <span 
                 key={tag} 
                 className="text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/80"
               >
                 {tag}
               </span>
             ))}
          </div>

          <h3 className="text-3xl md:text-4xl font-sans font-black italic tracking-tighter text-white mb-4 leading-none uppercase">
            {title}
          </h3>

          <AnimatePresence>
            {isHovered && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="text-sm md:text-base font-light text-white/60 leading-relaxed max-w-xs"
              >
                {description}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Glow Border Interaction */}
        <div className={`absolute inset-0 border-2 border-white/20 rounded-[2.5rem] transition-all duration-700 ${isHovered ? 'opacity-100 scale-[1.01]' : 'opacity-0 scale-100'}`} 
             style={{ boxShadow: 'inset 0 0 30px rgba(255,255,255,0.1)' }} />
      </div>

      {/* ── Animated Reflection Sweep ───────────────────────────────── */}
      <div className={`absolute top-0 left-[-100%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] transition-transform duration-[1500ms] ${isHovered ? 'translate-x-[200%]' : 'translate-x-0'}`} />
    </motion.div>
  );
};

export default ProjectLiquidCard;

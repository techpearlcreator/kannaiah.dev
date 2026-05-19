import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * RIVER FLOW DEVELOPER TIMELINE
 * ──────────────────────────────────────────────────────────────
 * A premium scroll-discovery timeline with a flowing shader river 
 * and 3D flipping glass cards.
 */

const stages = [
  {
    id: 1,
    title: "Foundation Layer",
    body: "Started learning HTML, CSS, JavaScript, and responsive web design fundamentals.",
    tags: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    color: "#30E3CA",
  },
  {
    id: 2,
    title: "Creative Frontend Layer",
    body: "Exploring UI/UX, frontend creativity, interactive interfaces, and modern web design.",
    tags: ["UI/UX", "Frontend", "Interaction", "Web Design"],
    color: "#7B61FF",
  },
  {
    id: 3,
    title: "Vibe Code Developer Layer",
    body: "Building cinematic web experiences using motion design, GSAP, Three.js, and AI-assisted workflows.",
    tags: ["GSAP", "Three.js", "Motion UI", "AI-assisted Coding"],
    color: "#c864ff",
  },
  {
    id: 4,
    title: "Backend Learning Layer",
    body: "Learning APIs, databases, authentication, debugging, and backend system flow.",
    tags: ["Node.js", "Express", "MongoDB", "Firebase", "Debugging"],
    color: "#4d79ff",
  },
  {
    id: 5,
    title: "AI Engineering Exploration",
    body: "Exploring AI tools, intelligent systems, automation, and future-focused product development.",
    tags: ["AI Tools", "Automation", "Prompt Engineering", "Intelligent Systems"],
    color: "#ff00ff",
  },
  {
    id: 6,
    title: "Industry-Ready Direction",
    body: "Improving practical skills, solving real problems, and preparing for real-world industry challenges.",
    tags: ["Problem Solving", "Real Projects", "Deployment", "Continuous Learning"],
    color: "#ffffff",
  }
];

// ─── Custom GLSL River Flow Shader ─────────────────────────────────────────
const RiverShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uFlowSpeed: { value: 1.0 },
    uColor: { value: new THREE.Color("#020205") },
    uHighlightColor: { value: new THREE.Color("#30E3CA") },
    uResolution: { value: new THREE.Vector2(1, 1) }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uFlowSpeed;
    uniform vec3 uColor;
    uniform vec3 uHighlightColor;
    varying vec2 vUv;

    // Simple noise-like flowing lines
    float lines(vec2 uv, float speed) {
      return sin(uv.x * 20.0 + uv.y * 10.0 + uTime * speed);
    }

    void main() {
      vec2 uv = vUv;
      
      // Flowing distortion
      float flow = lines(uv * 0.5, uFlowSpeed);
      float microFlow = lines(uv * 2.0, uFlowSpeed * 1.5);
      
      vec3 color = uColor;
      
      // Highlights / Water reflections
      float highlight = smoothstep(0.7, 1.0, flow * microFlow);
      color = mix(color, uHighlightColor, highlight * 0.1);
      
      // Subtle depth gradient
      color *= (1.0 - uv.y * 0.5);

      gl_FragColor = vec4(color, 1.0);
    }
  `
};

const RiverFlowTimeline = () => {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const shaderRef = useRef(null);
  const [activeStage, setActiveStage] = useState(0);
  const activeStageRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;

    const triggerCardFlip = (nextStage) => {
      const tl = gsap.timeline();
      
      // 1. Flip Card
      tl.to(cardRef.current, {
        rotationY: "+=180",
        z: 100,
        scale: 0.95,
        duration: 0.6,
        ease: "power2.inOut",
        onStart: () => {
           // Rush the river during flip
           if (shaderRef.current) {
             gsap.to(shaderRef.current.uniforms.uFlowSpeed, { value: 4, duration: 0.3 });
           }
        },
        onUpdate: function() {
          // Switch content at 90 degrees
          const progress = this.progress();
          if (progress >= 0.5 && activeStage !== nextStage) {
             setActiveStage(nextStage);
          }
        },
        onComplete: () => {
           gsap.to(cardRef.current, { z: 0, scale: 1, duration: 0.4 });
           if (shaderRef.current) {
             gsap.to(shaderRef.current.uniforms.uFlowSpeed, { value: 1, duration: 0.8 });
           }
        }
      });
    };

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: `+=${stages.length * 100}%`,
      pin: true,
      scrub: 1,
      snap: 1 / (stages.length - 1),
      onUpdate: (self) => {
        const stage = Math.round(self.progress * (stages.length - 1));
        if (stage !== activeStageRef.current) {
          activeStageRef.current = stage;
          triggerCardFlip(stage);
        }
      }
    });

    return () => {
      st.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [activeStage]);

  return (
    <section ref={sectionRef} className="relative w-full h-screen bg-[#020205] overflow-hidden">
      
      {/* ── WebGL River Background ───────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <RiverBackground shaderRef={shaderRef} />
        </Canvas>
      </div>

      {/* ── Floating Glass Card ───────────────────────────────────────── */}
      <div className="absolute inset-0 z-20 flex items-center justify-center p-6 perspective-[2000px]">
        <div 
          ref={cardRef}
          className="relative w-full max-w-4xl preserve-3d"
          style={{ transformStyle: 'preserve-3d' }}
        >
           <FloatingGlassCard stage={stages[activeStage]} index={activeStage} />
        </div>
      </div>

      {/* ── Stage Indicators ─────────────────────────────────────────── */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-6 items-center">
         <span className="text-[10px] font-mono text-white/20 vertical-text tracking-[0.5em] uppercase mb-4">
            Flow_Sequence
         </span>
         {stages.map((_, i) => (
            <div 
              key={i} 
              className={`w-1 h-12 rounded-full transition-all duration-700 ${activeStage === i ? 'bg-[#30E3CA] shadow-[0_0_15px_#30E3CA]' : 'bg-white/5'}`} 
            />
         ))}
      </div>

      <div className="absolute bottom-10 left-10 z-30 font-mono text-[9px] text-white/10 tracking-[0.8em] uppercase">
         Memories_Flowing // Stage_0{activeStage + 1}
      </div>

      <style jsx>{`
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </section>
  );
};

const RiverBackground = ({ shaderRef }) => {
  const { size } = useThree();
  
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      ...RiverShaderMaterial,
      uniforms: {
        ...RiverShaderMaterial.uniforms,
        uResolution: { value: new THREE.Vector2(size.width, size.height) }
      }
    });
  }, [size]);

  useEffect(() => {
    shaderRef.current = material;
  }, [material, shaderRef]);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[50, 50, 32, 32]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const FloatingGlassCard = ({ stage, index }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    // Reveal content after flip
    gsap.fromTo(contentRef.current.querySelectorAll('.stagger'),
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, delay: 0.2 }
    );
  }, [stage]);

  return (
    <div 
      className="relative p-12 md:p-24 rounded-[3.5rem] border border-white/10 bg-white/[0.01] backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden"
      style={{ backfaceVisibility: 'hidden' }}
    >
      {/* Water Shine Sweep */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-river-shine" />
      </div>

      <div ref={contentRef} className="relative z-10">
        <p className="text-[10px] tracking-[0.8em] font-black text-[#30E3CA] uppercase mb-10 stagger">
           Milestone 0{index + 1}
        </p>
        
        <h2 className="text-4xl md:text-8xl font-sans font-black italic tracking-tighter text-white mb-8 leading-none stagger">
           {stage.title}
        </h2>
        
        <p className="text-lg md:text-2xl font-light text-white/50 leading-relaxed max-w-2xl mb-12 stagger">
           {stage.body}
        </p>

        <div className="flex flex-wrap gap-3 stagger">
           {stage.tags.map(tag => (
             <span key={tag} className="text-[9px] tracking-widest font-bold text-white/30 border border-white/5 px-5 py-2.5 rounded-full uppercase hover:border-[#30E3CA]/40 hover:text-white transition-colors duration-500">
                {tag}
             </span>
           ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes river-shine {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
        .animate-river-shine {
          animation: river-shine 8s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default RiverFlowTimeline;

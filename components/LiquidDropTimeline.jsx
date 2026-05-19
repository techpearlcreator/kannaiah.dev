import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Html, PerspectiveCamera, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * LIQUID DROP DEVELOPER JOURNEY (FIXED V3)
 * ──────────────────────────────────────────────────────────────
 * WebGL Liquid Shader Timeline with Direct Mesh Targeting.
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

// ─── Custom GLSL Liquid Ripple Shader ─────────────────────────────────────────
const LiquidShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uRippleStrength: { value: 0 },
    uDropPosition: { value: new THREE.Vector2(0.5, 0.5) },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uColor: { value: new THREE.Color("#020205") }
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
    uniform float uProgress;
    uniform float uRippleStrength;
    uniform vec2 uDropPosition;
    uniform vec2 uResolution;
    uniform vec3 uColor;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      
      // Idle liquid noise
      float noise = sin(uv.x * 2.0 + uTime) * cos(uv.y * 2.0 + uTime) * 0.01;
      
      // Calculate distance from drop impact
      float dist = distance(uv, uDropPosition);
      
      // Ripple wave logic - High frequency for premium feel
      float wave = sin(dist * 60.0 - uTime * 6.0 + uProgress * 25.0);
      float ripple = wave * exp(-dist * 8.0) * uRippleStrength;
      
      // Base color with noise
      vec3 color = uColor + noise;
      
      // Chromatic aberration / RGB Split
      color.r += ripple * 0.25;
      color.b -= ripple * 0.25;
      
      // Caustic flash patterns
      float caustics = sin(uv.x * 20.0 + uTime) * cos(uv.y * 20.0 + uTime) * 0.1;
      color += caustics * uRippleStrength;

      gl_FragColor = vec4(color, 1.0);
    }
  `
};

const LiquidDropTimeline = () => {
  const sectionRef = useRef(null);
  const [activeStage, setActiveStage] = useState(0);
  const activeStageRef = useRef(0);
  const shaderRef = useRef(null);
  const dropRef = useRef(null); // Reference for the 3D Drop

  useEffect(() => {
    const section = sectionRef.current;

    const triggerLiquidTransition = (nextStage) => {
      if (!shaderRef.current || !dropRef.current) return;
      
      const tl = gsap.timeline();

      // 1. Water Drop Falls (Physical Mesh)
      tl.fromTo(dropRef.current.position, 
        { y: 5, z: 0 },
        { y: 0, z: 0, duration: 0.4, ease: "power2.in" }
      );
      tl.fromTo(dropRef.current.scale,
        { x: 0.5, y: 2, z: 0.5 },
        { x: 1, y: 1, z: 1, duration: 0.4, ease: "power2.in" },
        0
      );
      tl.to(dropRef.current.material, { opacity: 1, duration: 0.1 }, 0);

      // 2. Ripple Impact
      tl.set(dropRef.current.material, { opacity: 0 });
      
      // 3. Shader Ripple Animation
      tl.to(shaderRef.current.uniforms.uRippleStrength, {
        value: 1.8,
        duration: 0.3,
        ease: "power2.out",
        onStart: () => {
           setActiveStage(nextStage);
        }
      });

      tl.to(shaderRef.current.uniforms.uRippleStrength, {
        value: 0,
        duration: 1.5,
        ease: "power3.inOut"
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
          triggerLiquidTransition(stage);
        }
      }
    });

    return () => {
      st.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-screen bg-[#020205] overflow-hidden">
      
      {/* ── WebGL Liquid Background ──────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <LiquidBackground shaderRef={shaderRef} />
          
          {/* Falling Drop Mesh with Ref */}
          <mesh ref={dropRef} position={[0, 5, 0]}>
             <sphereGeometry args={[0.1, 32, 32]} />
             <meshBasicMaterial color="#00ffff" transparent opacity={0} />
          </mesh>
        </Canvas>
      </div>

      {/* ── Glass Stage Card (HTML Layer) ────────────────────────────── */}
      <div className="absolute inset-0 z-20 flex items-center justify-center p-6">
        <GlassStageCard stage={stages[activeStage]} index={activeStage} />
      </div>

      {/* ── Telemetry HUD ────────────────────────────────────────────── */}
      <div className="absolute bottom-10 left-10 z-30 font-mono text-[10px] text-white/20 tracking-[0.5em] uppercase">
         Liquid_Memory_Buffer // 0{activeStage + 1}
      </div>
      
      <div className="absolute bottom-10 right-10 z-30 flex items-center gap-4">
         {stages.map((_, i) => (
            <div key={i} className={`w-1 h-1 rounded-full transition-all duration-500 ${activeStage === i ? 'bg-[#00ffff] scale-[3] shadow-[0_0_10px_#00ffff]' : 'bg-white/10'}`} />
         ))}
      </div>
    </section>
  );
};

const LiquidBackground = ({ shaderRef }) => {
  const meshRef = useRef();
  const { size } = useThree();
  
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      ...LiquidShaderMaterial,
      uniforms: {
        ...LiquidShaderMaterial.uniforms,
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
    <mesh ref={meshRef}>
      <planeGeometry args={[20, 20]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const GlassStageCard = ({ stage, index }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    const el = contentRef.current;
    gsap.fromTo(el.querySelectorAll('.stagger'),
      { opacity: 0, y: 30, filter: "blur(10px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, stagger: 0.1, ease: "power2.out" }
    );
  }, [stage]);

  return (
    <div 
      ref={contentRef}
      className="relative w-full max-w-4xl p-12 md:p-24 rounded-[4rem] border border-white/10 bg-white/[0.01] backdrop-blur-3xl shadow-2xl overflow-hidden group"
    >
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
         <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-reflection" />
      </div>

      <div className="relative z-10">
        <p className="text-[10px] tracking-[0.8em] font-black text-[#00ffff] uppercase mb-10 stagger">
           Phase 0{index + 1}
        </p>
        
        <h2 className="text-4xl md:text-8xl font-sans font-black italic tracking-tighter text-white mb-8 leading-none stagger">
           {stage.title}
        </h2>
        
        <p className="text-lg md:text-2xl font-light text-white/50 leading-relaxed max-w-2xl mb-12 stagger">
           {stage.body}
        </p>

        <div className="flex flex-wrap gap-3 stagger">
           {stage.tags.map(tag => (
             <span key={tag} className="text-[9px] tracking-widest font-bold text-white/40 border border-white/10 px-4 py-2 rounded-full uppercase">
                {tag}
             </span>
           ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes reflection {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        .animate-reflection {
          animation: reflection 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LiquidDropTimeline;

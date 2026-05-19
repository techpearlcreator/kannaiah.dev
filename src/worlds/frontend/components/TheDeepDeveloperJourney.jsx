import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Float, Html, PerspectiveCamera, Text, useScroll, 
  ScrollControls, Scroll, Environment, Sphere, 
  MeshDistortMaterial, Sky, Stars, MeshWobbleMaterial,
  Sparkles, ContactShadows
} from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * THE DEEP DEVELOPER JOURNEY (UPGRADED V2)
 * ──────────────────────────────────────────────────────────────
 * Cinematic "Real World" Underwater Experience.
 * Features:
 * - Dynamic God Rays & Caustics
 * - Depth-based Lighting & Fog Transitions
 * - Shoreline Surface & Ocean Floor
 * - Advanced Marine Snow & Bubbles
 */

const journeyStages = [
  {
    id: 1,
    title: "Shore of Curiosity",
    body: "Learning HTML, CSS, JavaScript and responsive web fundamentals.",
    meaning: "The beginning of an obsession.",
    depth: 0,
    color: "#E2DBF8", // Lilac
    fogColor: "#E2DBF8",
  },
  {
    id: 2,
    title: "Creative Ocean",
    body: "Exploring UI/UX, frontend creativity, and interactive experiences.",
    meaning: "Frontend stopped being functional — it became art.",
    depth: -25,
    color: "#30E3CA", // Teal
    fogColor: "#10375C", // Deep Blue
  },
  {
    id: 3,
    title: "Motion Depths",
    body: "Building cinematic web experiences using GSAP, Three.js, and AI workflows.",
    meaning: "Physics and motion define the experience.",
    depth: -55,
    color: "#6444e4", // Purple
    fogColor: "#0A0A2A", // Midnight Blue
  },
  {
    id: 4,
    title: "System Depths",
    body: "Learning APIs, databases, backend logic, and system architecture.",
    meaning: "The engine beneath the beauty.",
    depth: -85,
    color: "#1a1a2e", // Dark Navy
    fogColor: "#020205", // Near Black
  },
  {
    id: 5,
    title: "AI Abyss",
    body: "Exploring intelligent systems, AI tools, and future-focused development.",
    meaning: "The horizon of digital intelligence.",
    depth: -120,
    color: "#000000",
    fogColor: "#000000",
  }
];

const TheDeepDeveloperJourney = () => {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => setScrollProgress(self.progress),
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <div ref={containerRef} className="relative h-[1000vh] bg-black">
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        <Canvas shadows camera={{ position: [0, 5, 10], fov: 45 }}>
          <OceanScene progress={scrollProgress} />
        </Canvas>

        {/* Cinematic Post-Overlay */}
        <div className="absolute inset-0 pointer-events-none z-50 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] opacity-60" />
        <div className="absolute inset-0 pointer-events-none z-50 opacity-20" 
             style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, rgba(0,0,0,0.1) 1px, transparent 2px)' }} />
      </div>

      {/* Floating Depth HUD */}
      <div className="fixed top-1/2 left-10 -translate-y-1/2 z-[60] flex flex-col items-start gap-2 pointer-events-none opacity-40">
        <div className="text-[8px] font-mono text-[#7B61FF] tracking-[0.4em] uppercase">Telemetry</div>
        <div className="text-xl font-mono text-white/60">
          {Math.round(scrollProgress * 2500)}m
        </div>
        <div className="w-16 h-[1px] bg-white/20 mt-2" />
      </div>
    </div>
  );
};

const OceanScene = ({ progress }) => {
  const { camera, scene } = useThree();
  const currentDepth = -progress * 150; // Total vertical travel

  useFrame((state, delta) => {
    // 1. Smooth Camera Dive
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, currentDepth + 2, 0.1);
    state.camera.lookAt(0, state.camera.position.y - 5, 0);
    
    // 2. Underwater Sway
    state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.3;
    state.camera.rotation.z = Math.cos(state.clock.elapsedTime * 0.2) * 0.02;

    // 3. Dynamic Fog & Background Transition
    const stageIndex = Math.min(Math.floor(progress * journeyStages.length), journeyStages.length - 1);
    const targetFogColor = new THREE.Color(journeyStages[stageIndex].fogColor);
    scene.fog.color.lerp(targetFogColor, 0.05);
    scene.background = scene.fog.color;
  });

  return (
    <>
      <fog attach="fog" args={["#E2DBF8", 0, 40]} />
      
      {/* ── Lighting System ───────────────────────────────────────────── */}
      <directionalLight position={[5, 10, 5]} intensity={1.5} color="#fff" />
      <pointLight position={[0, currentDepth, 0]} intensity={2} color="#7B61FF" decay={2} distance={50} />
      <ambientLight intensity={0.2} />

      {/* ── Environment Objects ───────────────────────────────────────── */}
      <OceanSurface />
      <GodRays />
      
      <group>
        {journeyStages.map((stage, i) => (
          <JourneyMilestone key={i} stage={stage} index={i} active={progress * journeyStages.length > i} />
        ))}
      </group>

      <MarineSnow />
      <OceanFloor depth={-160} />
    </>
  );
};

// ─── Phase 1: Shoreline & Surface ────────────────────────────────────────────
const OceanSurface = () => {
  return (
    <group position={[0, 5, 0]}>
      {/* The visible water surface from below */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <MeshDistortMaterial 
          color="#7B61FF" 
          opacity={0.4} 
          transparent 
          distort={0.4} 
          speed={2} 
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Sun glow at the surface */}
      <Sparkles count={50} scale={20} size={2} speed={0.5} color="#fff" />
    </group>
  );
};

// ─── Cinematic Trick: God Rays ───────────────────────────────────────────────
const GodRays = () => {
  return (
    <group position={[0, 0, -10]}>
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[(i - 2) * 8, 0, 0]} rotation={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.5, 3, 200, 8]} />
          <meshBasicMaterial 
            color="#fff" 
            transparent 
            opacity={0.05} 
            blending={THREE.AdditiveBlending} 
          />
        </mesh>
      ))}
    </group>
  );
};

// ─── Journey Milestone (Upgraded HUD) ────────────────────────────────────────
const JourneyMilestone = ({ stage, index, active }) => {
  return (
    <group position={[0, stage.depth, 0]}>
      {/* 3D Anchor Element */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <mesh position={[0, 0, -5]}>
          <sphereGeometry args={[2, 32, 32]} />
          <MeshDistortMaterial 
            color={stage.color} 
            distort={0.5} 
            speed={2} 
            transparent 
            opacity={active ? 0.4 : 0.1}
          />
        </mesh>
      </Float>

      {/* Futuristic HUD Panel */}
      <Html 
        position={[4, 0, -5]} 
        center 
        transform 
        distanceFactor={10}
        className={`transition-all duration-1000 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="w-[450px] p-10 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-3xl text-white select-none">
          {/* HUD Accents */}
          <div className="absolute -top-px left-10 w-20 h-[2px] bg-[#7B61FF]" />
          <div className="absolute top-4 right-6 text-[8px] font-mono text-[#7B61FF]">
            SYNC_NODE_{index + 1} // STABLE
          </div>

          <p className="text-[10px] tracking-[0.5em] font-black text-[#7B61FF] uppercase mb-4">
            0{index + 1} // {stage.depth}m
          </p>
          
          <h3 className="text-4xl font-sans font-black italic tracking-tighter mb-4 leading-none">
            {stage.title}
          </h3>
          
          <p className="text-sm font-light text-white/50 leading-relaxed mb-8 border-l border-white/10 pl-6">
            {stage.body}
          </p>

          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#7B61FF] animate-pulse" />
             </div>
             <p className="text-[9px] tracking-widest uppercase font-mono text-white/40 italic">
               {stage.meaning}
             </p>
          </div>
        </div>
      </Html>

      {/* Depth Pulse Wave */}
      {active && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[10, 10.5, 64]} />
          <meshBasicMaterial color={stage.color} transparent opacity={0.1} />
        </mesh>
      )}
    </group>
  );
};

// ─── Marine Snow (Cinematic Particles) ───────────────────────────────────────
const MarineSnow = () => {
  const count = 1500;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 300;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    return pos;
  }, []);

  const pointsRef = useRef();
  useFrame((state) => {
    pointsRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    pointsRef.current.rotation.y += 0.001;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={count} 
          array={positions} 
          itemSize={3} 
        />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#fff" transparent opacity={0.2} sizeAttenuation />
    </points>
  );
};

const OceanFloor = ({ depth }) => {
  return (
    <group position={[0, depth, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#050510" roughness={1} />
      </mesh>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </group>
  );
};

export default TheDeepDeveloperJourney;

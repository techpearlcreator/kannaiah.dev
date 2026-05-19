import React, { useRef, useMemo, Suspense, useState, useEffect, memo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

/**
 * LiquidImage.jsx (High-End Studio Version)
 * ──────────────────────────────────────────────────────────────
 * - Extreme liquid distortion inspired by fromanother.love.
 * - Uses a fluid UV displacement map logic.
 * - Reactive to mouse movement with organic jelly-like physics.
 */

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uStrength;
  uniform vec2 uImageRes;
  uniform vec2 uPlaneRes;

  varying vec2 vUv;

  // Simplex Noise for organic waves
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 a0 = x - floor(x + 0.5);
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    // 1. Correct Aspect Ratio (Object-Fit: Cover)
    float rs = uPlaneRes.x / uPlaneRes.y;
    float ri = uImageRes.x / uImageRes.y;
    vec2 uv = vUv;
    if (rs > ri) {
        uv.y = uv.y * ri / rs + 0.5 * (1.0 - ri / rs);
    } else {
        uv.x = uv.x * rs / ri + 0.5 * (1.0 - rs / ri);
    }

    // 2. Liquid Distortion Logic (The "fromanother.love" feel)
    
    // Background fluid waves
    float noiseX = snoise(uv * 3.0 + uTime * 0.2);
    float noiseY = snoise(uv * 3.0 + uTime * 0.2 + 10.0);
    vec2 noiseDisp = vec2(noiseX, noiseY) * 0.02 * uHover;

    // Mouse-driven fluid distortion
    vec2 mouseDisp = vec2(0.0);
    float dist = distance(vUv, uMouse);
    float mouseStrength = smoothstep(0.5, 0.0, dist);
    
    // Wave ripple based on distance
    float ripple = sin(dist * 10.0 - uTime * 4.0) * 0.5 + 0.5;
    mouseDisp = (vUv - uMouse) * ripple * mouseStrength * uStrength * 0.15;

    // Combine displacements
    vec2 finalUv = uv + noiseDisp + mouseDisp;
    
    // Clamp UVs to prevent edge artifacts
    finalUv = clamp(finalUv, 0.001, 0.999);

    // 3. Chromatic Aberration (RGB Shift)
    // Shift is proportional to distortion strength
    float shift = length(noiseDisp + mouseDisp) * 0.5 + (uHover * 0.01);
    float r = texture2D(uTexture, finalUv + vec2(shift, 0.0)).r;
    float g = texture2D(uTexture, finalUv).g;
    float b = texture2D(uTexture, finalUv - vec2(shift, 0.0)).b;
    
    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

const LiquidPlane = ({ imageUrl, mousePos, isHovered, planeSize }) => {
  const meshRef = useRef();
  const texture = useTexture(imageUrl);
  const { viewport } = useThree();

  useEffect(() => {
    if (texture) {
      texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.needsUpdate = true;
    }
  }, [texture]);

  const uniforms = useMemo(() => ({
    uTexture: { value: texture },
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uHover: { value: 0 },
    uStrength: { value: 0 },
    uImageRes: { value: new THREE.Vector2(texture.image?.width || 1024, texture.image?.height || 1024) },
    uPlaneRes: { value: new THREE.Vector2(planeSize.width, planeSize.height) }
  }), [texture, planeSize]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    uniforms.uTime.value = state.clock.getElapsedTime();
    
    // Easing for hover and strength
    const targetHover = isHovered ? 1.0 : 0.0;
    uniforms.uHover.value = THREE.MathUtils.lerp(uniforms.uHover.value, targetHover, 0.05);
    
    const targetMouse = new THREE.Vector2(mousePos.x, mousePos.y);
    uniforms.uMouse.value.lerp(targetMouse, 0.08); // Softer delay
    
    const velocity = targetMouse.distanceTo(uniforms.uMouse.value);
    const targetStrength = isHovered ? Math.max(0.8, velocity * 60.0) : 0.0;
    uniforms.uStrength.value = THREE.MathUtils.lerp(uniforms.uStrength.value, targetStrength, 0.05);

    // Subtle 3D-like scale
    const s = 1.0 + uniforms.uHover.value * 0.03;
    meshRef.current.scale.set(viewport.width * s, viewport.height * s, 1);
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1, 128, 128]} /> {/* Higher poly for smoother waves */}
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  );
};

const LiquidImage = memo(({ src, className = "" }) => {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);
  const [planeSize, setPlaneSize] = useState({ width: 800, height: 1000 });
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      setPlaneSize({ 
        width: containerRef.current.clientWidth, 
        height: containerRef.current.clientHeight 
      });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({ 
      x: (e.clientX - rect.left) / rect.width, 
      y: 1.0 - (e.clientY - rect.top) / rect.height 
    });
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full h-full overflow-hidden bg-[#e0ddd5] group shadow-inner ${className}`}
      style={{ isolation: 'isolate' }}
    >
      <Canvas 
        camera={{ position: [0, 0, 1], fov: 50 }} 
        dpr={[1, 2]} 
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ pointerEvents: 'none', position: 'absolute', inset: 0, zIndex: 1 }}
      >
        <Suspense fallback={null}>
          <LiquidPlane 
            imageUrl={src} 
            mousePos={mousePos} 
            isHovered={isHovered} 
            planeSize={planeSize}
          />
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 z-0 pointer-events-none bg-black/5 mix-blend-multiply opacity-20" />
    </div>
  );
});

export default LiquidImage;

import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

/**
 * LiquidImageShader
 * ──────────────────────────────────────────────────────────────
 * Renders a project image with WebGL Liquid Distortion.
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
  uniform vec2 uPrevMouse;
  uniform float uVelocity;
  uniform float uHover;
  uniform float uStrength;

  varying vec2 vUv;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
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
    vec2 uv = vUv;
    float mouseDistance = distance(uv, uMouse);
    float mouseForce = smoothstep(0.4, 0.0, mouseDistance);
    
    float noise = snoise(uv * 3.5 + uTime * 0.2);
    vec2 displacement = vec2(noise) * 0.02 * (1.0 + uHover * 1.5);
    
    vec2 mouseDir = normalize(uMouse - uPrevMouse + 0.0001);
    displacement += mouseDir * mouseForce * uVelocity * 0.15 * uHover;
    
    vec2 distortedUv = uv + displacement * uStrength;
    
    float aberration = uVelocity * 0.015 * uHover;
    float r = texture2D(uTexture, distortedUv + vec2(aberration, 0.0)).r;
    float g = texture2D(uTexture, distortedUv).g;
    float b = texture2D(uTexture, distortedUv - vec2(aberration, 0.0)).b;
    
    vec3 color = vec3(r, g, b);
    
    float reflection = smoothstep(0.4, 0.45, distortedUv.x + distortedUv.y - fract(uTime * 0.08) * 2.5);
    color += reflection * 0.06 * uHover;
    color += uHover * 0.05;

    gl_FragColor = vec4(color, 1.0);
  }
`;

const LiquidImageShader = ({ imageUrl, isHovered, mousePos }) => {
  const meshRef = useRef();
  const texture = useTexture(imageUrl);
  const { viewport } = useThree();

  // Optimized Uniforms
  const uniforms = useMemo(() => ({
    uTexture: { value: texture },
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uPrevMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uVelocity: { value: 0 },
    uHover: { value: 0 },
    uStrength: { value: 1.0 },
    uResolution: { value: new THREE.Vector2(1, 1) }
  }), [texture]);

  useFrame((state) => {
    const { clock } = state;
    if (!meshRef.current) return;

    // 1. Update Time
    uniforms.uTime.value = clock.getElapsedTime();

    // 2. Smooth Hover Transition
    uniforms.uHover.value = THREE.MathUtils.lerp(
      uniforms.uHover.value,
      isHovered ? 1.0 : 0.0,
      0.1
    );

    // 3. Mouse Logic
    const targetMouse = new THREE.Vector2(mousePos.x, mousePos.y);
    
    // Calculate Velocity
    const velocity = targetMouse.distanceTo(uniforms.uMouse.value);
    uniforms.uVelocity.value = THREE.MathUtils.lerp(uniforms.uVelocity.value, velocity * 20.0, 0.1);
    
    // Update Positions
    uniforms.uPrevMouse.value.copy(uniforms.uMouse.value);
    uniforms.uMouse.value.lerp(targetMouse, 0.15);
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  );
};

export default LiquidImageShader;

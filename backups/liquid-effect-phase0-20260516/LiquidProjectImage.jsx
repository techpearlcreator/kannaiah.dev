/* eslint-disable react-hooks/immutability */
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const DEBUG_DISPLACEMENT = true;
const DISPLACEMENT_SIZE = 512;

const getDebugAutomaticWave = () => (
  typeof window !== 'undefined'
  && new URLSearchParams(window.location.search).has('debugLiquidWave')
);

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform sampler2D uDisplacement;
  uniform float uTime;
  uniform float uStrength;
  uniform vec2 uMouse;
  uniform float uDebugWave;
  uniform float uPlaneAspect;
  uniform float uImageAspect;

  varying vec2 vUv;

  vec2 coverUv(vec2 uv) {
    vec2 coveredUv = uv;

    if (uPlaneAspect > uImageAspect) {
      float scale = uImageAspect / uPlaneAspect;
      coveredUv.y = uv.y * scale + (1.0 - scale) * 0.5;
    } else {
      float scale = uPlaneAspect / uImageAspect;
      coveredUv.x = uv.x * scale + (1.0 - scale) * 0.5;
    }

    return coveredUv;
  }

  void main() {
    vec2 imageUv = coverUv(vUv);

    if (uDebugWave > 0.5) {
      vec2 waveUv = imageUv;
      waveUv.x += sin(vUv.y * 30.0 + uTime * 5.0) * 0.06;
      gl_FragColor = texture2D(uTexture, clamp(waveUv, 0.001, 0.999));
      return;
    }

    float d = texture2D(uDisplacement, vUv).r;
    vec2 dir = normalize(vUv - uMouse + 0.0001);
    vec2 uv = imageUv + dir * d * uStrength * 0.12;
    uv.x += sin(vUv.y * 8.0 + uTime * 0.8) * 0.002;

    gl_FragColor = texture2D(uTexture, clamp(uv, 0.001, 0.999));
  }
`;

const createDisplacementTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = DISPLACEMENT_SIZE;
  canvas.height = DISPLACEMENT_SIZE;

  const ctx = canvas.getContext('2d', { willReadFrequently: false });
  ctx.fillStyle = 'rgb(0,0,0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.NoColorSpace;

  return { canvas, ctx, texture };
};

const createPlaceholderTexture = () => {
  const data = new Uint8Array([229, 231, 235, 255]);
  const texture = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
};

const stampBrush = (ctx, x, y, radius, strength) => {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);

  gradient.addColorStop(0, `rgba(255,255,255,${strength})`);
  gradient.addColorStop(0.4, `rgba(255,255,255,${0.42 * strength})`);
  gradient.addColorStop(1, 'rgba(255,255,255,0)');

  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
};

const ImagePlane = ({
  src,
  displacementApiRef,
  displacementCanvasRef,
  mouseRef,
  strengthRef,
}) => {
  const { viewport } = useThree();
  const placeholderTexture = useMemo(() => createPlaceholderTexture(), []);
  const [texture, setTexture] = useState(placeholderTexture);
  const displacement = useMemo(() => createDisplacementTexture(), []);
  const debugAutomaticWave = useMemo(() => getDebugAutomaticWave(), []);
  const materialRef = useRef(null);
  const lastUpdateLog = useRef(0);
  const isMobile = viewport.width < 6;

  useEffect(() => {
    let isActive = true;
    const loader = new THREE.TextureLoader();

    loader.load(src, (loadedTexture) => {
      if (!isActive) {
        loadedTexture.dispose();
        return;
      }

      loadedTexture.minFilter = THREE.LinearFilter;
      loadedTexture.magFilter = THREE.LinearFilter;
      loadedTexture.generateMipmaps = false;
      loadedTexture.colorSpace = THREE.SRGBColorSpace;
      loadedTexture.needsUpdate = true;
      setTexture(loadedTexture);

      console.log('[LiquidProjectImage] texture loaded', src, {
        width: loadedTexture.image?.width,
        height: loadedTexture.image?.height,
      });
    });

    return () => {
      isActive = false;
    };
  }, [src]);

  useEffect(() => {
    displacementCanvasRef.current = displacement.canvas;

    displacementApiRef.current = {
      drawTrail(previous, current, velocityStrength) {
        const canvas = displacement.canvas;
        const ctx = displacement.ctx;
        const dx = current.x - previous.x;
        const dy = current.y - previous.y;
        const distance = Math.hypot(dx, dy);
        const steps = Math.max(1, Math.ceil(distance * canvas.width / 16));
        const strength = THREE.MathUtils.clamp(0.35 + velocityStrength * 0.75, 0.35, 1.0);
        const radius = (isMobile ? 80 : 110) + velocityStrength * 30;

        for (let i = 0; i <= steps; i += 1) {
          const t = i / steps;
          const x = (previous.x + dx * t) * canvas.width;
          const y = (1 - (previous.y + dy * t)) * canvas.height;
          stampBrush(ctx, x, y, radius, strength);
        }

        displacement.texture.needsUpdate = true;
        console.log('[LiquidProjectImage] mouse move');
        console.log('[LiquidProjectImage] velocity strength', Number(velocityStrength.toFixed(3)));
      },
    };

    return () => {
      displacementApiRef.current = null;
      displacementCanvasRef.current = null;
      displacement.texture.dispose();
    };
  }, [displacement, displacementApiRef, displacementCanvasRef, isMobile]);

  const uniforms = useMemo(() => ({
    uTexture: { value: texture },
    uDisplacement: { value: displacement.texture },
    uTime: { value: 0 },
    uStrength: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uDebugWave: { value: debugAutomaticWave ? 1 : 0 },
    uPlaneAspect: { value: viewport.width / viewport.height },
    uImageAspect: { value: (texture.image?.width || 1) / (texture.image?.height || 1) },
  }), [debugAutomaticWave, displacement.texture, texture, viewport.height, viewport.width]);

  useEffect(() => {
    uniforms.uTexture.value = texture;
    uniforms.uImageAspect.value = (texture.image?.width || 1) / (texture.image?.height || 1);
    texture.needsUpdate = true;
  }, [texture, uniforms]);

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();

    displacement.ctx.globalCompositeOperation = 'source-over';
    displacement.ctx.fillStyle = 'rgba(0,0,0,0.03)';
    displacement.ctx.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height);
    displacement.texture.needsUpdate = true;

    uniforms.uTime.value = elapsedTime;
    uniforms.uMouse.value.lerp(mouseRef.current, 0.35);
    uniforms.uPlaneAspect.value = viewport.width / viewport.height;
    uniforms.uStrength.value = THREE.MathUtils.lerp(uniforms.uStrength.value, strengthRef.current, 0.12);
    strengthRef.current = THREE.MathUtils.lerp(strengthRef.current, 0, 0.025);

    if (elapsedTime - lastUpdateLog.current > 1.5) {
      lastUpdateLog.current = elapsedTime;
      console.log('[LiquidProjectImage] displacement texture updating', {
        uStrength: Number(uniforms.uStrength.value.toFixed(3)),
        debugAutomaticWave,
      });
    }
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

const getWebGLAvailable = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return true;

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return Boolean(window.WebGLRenderingContext && gl);
  } catch {
    return false;
  }
};

const LiquidProjectImage = ({ src, alt = 'Project Image', className = '' }) => {
  const [isWebGLAvailable] = useState(getWebGLAvailable);
  const [debugPreviewSrc, setDebugPreviewSrc] = useState('');
  const displacementApiRef = useRef(null);
  const displacementCanvasRef = useRef(null);
  const mouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const previousMouseRef = useRef(null);
  const strengthRef = useRef(0);

  useEffect(() => {
    console.log('[LiquidProjectImage] Liquid image src', src);
  }, [src]);

  useEffect(() => {
    if (!DEBUG_DISPLACEMENT) return undefined;

    const id = window.setInterval(() => {
      if (displacementCanvasRef.current) {
        setDebugPreviewSrc(displacementCanvasRef.current.toDataURL());
      }
    }, 500);

    return () => window.clearInterval(id);
  }, []);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = THREE.MathUtils.clamp((event.clientX - rect.left) / rect.width, 0, 1);
    const y = THREE.MathUtils.clamp(1 - ((event.clientY - rect.top) / rect.height), 0, 1);
    const currentMouse = { x, y };
    const previousMouse = previousMouseRef.current ?? currentMouse;
    const dx = currentMouse.x - previousMouse.x;
    const dy = currentMouse.y - previousMouse.y;
    const velocityStrength = THREE.MathUtils.clamp(Math.hypot(dx, dy) * 24, 0, 1);

    mouseRef.current.set(x, y);
    strengthRef.current = THREE.MathUtils.clamp(1.0 + velocityStrength * 0.7, 1.0, 1.7);
    displacementApiRef.current?.drawTrail(previousMouse, currentMouse, velocityStrength);
    previousMouseRef.current = currentMouse;
  };

  const handleMouseEnter = (event) => {
    previousMouseRef.current = null;
    strengthRef.current = 0.8;
    handleMouseMove(event);
  };

  const handleMouseLeave = () => {
    previousMouseRef.current = null;
    strengthRef.current = 0;
  };

  if (!isWebGLAvailable) {
    return <img src={src} alt={alt} className={`object-cover ${className}`} />;
  }

  return (
    <div
      className={`liquid-project-image ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: '28px',
        backgroundColor: '#e5e7eb',
        pointerEvents: 'auto',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 1], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }}
      >
        <Suspense fallback={null}>
          <ImagePlane
            src={src}
            displacementApiRef={displacementApiRef}
            displacementCanvasRef={displacementCanvasRef}
            mouseRef={mouseRef}
            strengthRef={strengthRef}
          />
        </Suspense>
      </Canvas>

      {DEBUG_DISPLACEMENT && debugPreviewSrc && (
        <img
          src={debugPreviewSrc}
          alt=""
          aria-hidden="true"
          style={{
            position: 'fixed',
            right: 16,
            bottom: 16,
            width: 140,
            height: 140,
            zIndex: 9999,
            border: '1px solid rgba(255,255,255,0.5)',
            background: '#000',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};

export default LiquidProjectImage;

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const createPlaceholderTexture = () => {
  const data = new Uint8Array([229, 231, 235, 255]);
  const texture = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
};

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
  uniform vec2 uTexel;
  uniform float uTime;
  uniform float uHover;
  uniform float uStrength;
  varying vec2 vUv;

  void main() {
    float center = texture2D(uDisplacement, vUv).r;
    float left = texture2D(uDisplacement, vUv - vec2(uTexel.x, 0.0)).r;
    float right = texture2D(uDisplacement, vUv + vec2(uTexel.x, 0.0)).r;
    float down = texture2D(uDisplacement, vUv - vec2(0.0, uTexel.y)).r;
    float up = texture2D(uDisplacement, vUv + vec2(0.0, uTexel.y)).r;

    vec2 gradient = vec2(right - left, up - down);
    float field = smoothstep(0.01, 0.7, center);
    vec2 offset = gradient * (0.19 + center * 0.14) * uStrength * uHover;
    offset += gradient * sin(uTime * 1.1 + center * 9.0) * 0.0032 * uHover;
    vec2 uv = clamp(vUv + offset, 0.001, 0.999);

    float aberration = min(length(offset) * 0.62, 0.0021) * uHover;
    vec2 chromaDir = normalize(gradient + vec2(0.0001));
    vec3 col;
    col.r = texture2D(uTexture, clamp(uv + chromaDir * aberration, 0.001, 0.999)).r;
    col.g = texture2D(uTexture, uv).g;
    col.b = texture2D(uTexture, clamp(uv - chromaDir * aberration, 0.001, 0.999)).b;

    float caustic = smoothstep(0.08, 0.7, field) * min(length(offset) * 7.0, 1.0) * 0.034 * uHover;
    col += vec3(caustic);
    gl_FragColor = vec4(col, 1.0);
  }
`;

const ImagePlane = ({ src, displacementStateRef, hoverRef }) => {
  const { viewport } = useThree();
  const placeholderTexture = useMemo(() => createPlaceholderTexture(), []);
  const [texture, setTexture] = useState(placeholderTexture);
  const displacementState = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const blurCanvas = document.createElement('canvas');
    blurCanvas.width = 512;
    blurCanvas.height = 512;

    const ctx = canvas.getContext('2d');
    const blurCtx = blurCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    if (blurCtx) {
      blurCtx.fillStyle = '#000000';
      blurCtx.fillRect(0, 0, blurCanvas.width, blurCanvas.height);
    }

    const displacementTexture = new THREE.CanvasTexture(canvas);
    displacementTexture.minFilter = THREE.LinearFilter;
    displacementTexture.magFilter = THREE.LinearFilter;
    displacementTexture.generateMipmaps = false;
    displacementTexture.wrapS = THREE.ClampToEdgeWrapping;
    displacementTexture.wrapT = THREE.ClampToEdgeWrapping;
    displacementTexture.needsUpdate = true;

    return { canvas, ctx, blurCanvas, blurCtx, displacementTexture };
  }, []);
  const uniforms = useMemo(() => ({
    uTexture: { value: texture },
    uDisplacement: { value: displacementState.displacementTexture },
    uTexel: { value: new THREE.Vector2(1 / 512, 1 / 512) },
    uTime: { value: 0 },
    uHover: { value: 0 },
    uStrength: { value: 0.78 },
  }), [texture, displacementState]);

  useEffect(() => {
    displacementStateRef.current = displacementState;
  }, [displacementState, displacementStateRef]);

  useEffect(() => {
    uniforms.uTexture.value = texture;
  }, [texture, uniforms]);

  useEffect(() => () => {
    displacementState.displacementTexture.dispose();
  }, [displacementState]);

  useFrame(() => {
    const { ctx, canvas, blurCtx, blurCanvas, displacementTexture } = displacementState;
    if (!ctx || !blurCtx) return;
    uniforms.uTime.value += 0.016;
    uniforms.uHover.value = THREE.MathUtils.lerp(uniforms.uHover.value, hoverRef.current, 0.05);

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.013)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    blurCtx.clearRect(0, 0, blurCanvas.width, blurCanvas.height);
    blurCtx.globalAlpha = 0.3;
    blurCtx.drawImage(canvas, -1, 0);
    blurCtx.drawImage(canvas, 1, 0);
    blurCtx.drawImage(canvas, 0, -1);
    blurCtx.drawImage(canvas, 0, 1);
    blurCtx.drawImage(canvas, -2, 0);
    blurCtx.drawImage(canvas, 2, 0);
    blurCtx.drawImage(canvas, 0, -2);
    blurCtx.drawImage(canvas, 0, 2);
    blurCtx.drawImage(canvas, 0, 0);
    blurCtx.globalAlpha = 1;

    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 0.46;
    ctx.drawImage(blurCanvas, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    displacementTexture.needsUpdate = true;
  });

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
    });

    return () => {
      isActive = false;
    };
  }, [src]);

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
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
  const wrapperRef = useRef(null);
  const displacementStateRef = useRef(null);
  const previousMouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const hoverRef = useRef(0);

  const stampBrush = (state, uv, speed, velocity) => {
    if (!state?.ctx) return;

    const { ctx, canvas, displacementTexture } = state;
    const px = uv.x * canvas.width;
    const py = (1 - uv.y) * canvas.height;
    const radius = THREE.MathUtils.clamp(34 + speed * 250, 34, 128);
    const alpha = THREE.MathUtils.clamp(0.1 + speed * 0.38, 0.1, 0.45);
    const vx = THREE.MathUtils.clamp(velocity.x * canvas.width * 0.48, -44, 44);
    const vy = THREE.MathUtils.clamp(-velocity.y * canvas.height * 0.48, -44, 44);
    const tx = px + vx;
    const ty = py + vy;
    const gradient = ctx.createRadialGradient(px, py, radius * 0.12, px, py, radius);
    gradient.addColorStop(0, `rgba(255,255,255,${alpha})`);
    gradient.addColorStop(0.45, `rgba(210,220,255,${alpha * 0.48})`);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(px, py, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(tx, ty, radius * 0.85, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    displacementTexture.needsUpdate = true;
  };

  const injectDisplacementStroke = (currentUv) => {
    const state = displacementStateRef.current;
    if (!state?.ctx) return;

    const prev = previousMouseRef.current;
    const deltaX = currentUv.x - prev.x;
    const deltaY = currentUv.y - prev.y;
    const speed = Math.min(Math.sqrt((deltaX * deltaX) + (deltaY * deltaY)) * 7.2, 1.0);
    const distance = Math.max(Math.sqrt((deltaX * deltaX) + (deltaY * deltaY)), 0.0001);
    const steps = Math.max(1, Math.ceil(distance * 52));

    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps;
      const uv = new THREE.Vector2(
        THREE.MathUtils.lerp(prev.x, currentUv.x, t),
        THREE.MathUtils.lerp(prev.y, currentUv.y, t),
      );
      stampBrush(state, uv, speed, new THREE.Vector2(deltaX, deltaY));
    }

    previousMouseRef.current.copy(currentUv);
    console.log('[LiquidProjectImage] mouse position', currentUv.x.toFixed(3), currentUv.y.toFixed(3));
    console.log('[LiquidProjectImage] velocity', deltaX.toFixed(4), deltaY.toFixed(4), 'speed', speed.toFixed(3));
    console.log('[LiquidProjectImage] displacement texture updating');
  };

  const handleMouseEnter = (event) => {
    hoverRef.current = 1;
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = THREE.MathUtils.clamp((event.clientX - rect.left) / rect.width, 0, 1);
    const y = THREE.MathUtils.clamp(1 - ((event.clientY - rect.top) / rect.height), 0, 1);
    previousMouseRef.current.set(x, y);
  };

  const handleMouseMove = (event) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = THREE.MathUtils.clamp((event.clientX - rect.left) / rect.width, 0, 1);
    const y = THREE.MathUtils.clamp(1 - ((event.clientY - rect.top) / rect.height), 0, 1);
    injectDisplacementStroke(new THREE.Vector2(x, y));
  };

  const handleMouseLeave = () => {
    hoverRef.current = 0;
  };

  if (!isWebGLAvailable) {
    return <img src={src} alt={alt} className={`object-cover ${className}`} />;
  }

  return (
    <div
      ref={wrapperRef}
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
        <ImagePlane
          src={src}
          displacementStateRef={displacementStateRef}
          hoverRef={hoverRef}
        />
      </Canvas>
    </div>
  );
};

export default LiquidProjectImage;

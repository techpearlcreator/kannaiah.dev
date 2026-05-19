import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { getLiquidProjectTexture, loadLiquidProjectTexture } from './liquidProjectTexture';

const passVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const simulationFragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform float uDissipation;
  uniform float uBrushRadius;
  uniform float uVelocity;
  varying vec2 vUv;

  void main() {
    vec2 texelSize = vec2(1.0 / 64.0);
    vec2 current = texture2D(uTexture, vUv).xy;

    float left = texture2D(uTexture, vUv + vec2(-texelSize.x, 0.0)).r;
    float right = texture2D(uTexture, vUv + vec2(texelSize.x, 0.0)).r;
    float top = texture2D(uTexture, vUv + vec2(0.0, -texelSize.y)).r;
    float bottom = texture2D(uTexture, vUv + vec2(0.0, texelSize.y)).r;

    float average = (left + right + top + bottom) * 0.25;
    current.y += (average - current.r) * 0.5;
    current.y *= uDissipation;
    current.r += current.y;

    float distMouse = distance(vUv, uMouse);
    float brushMouse = smoothstep(uBrushRadius, 0.0, distMouse);
    current.r += brushMouse * uVelocity;

    current.r *= 0.98;
    current.y *= 0.98;

    gl_FragColor = vec4(clamp(current.r, -5.0, 5.0), clamp(current.y, -5.0, 5.0), 0.0, 1.0);
  }
`;

const imageVertexShader = `
  precision mediump float;

  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const imageFragmentShader = `
  precision mediump float;

  uniform sampler2D uTexture;
  uniform sampler2D uDisplacementMap;
  uniform vec2 uMeshSize;
  uniform vec2 uImageSize;
  uniform float uScale;
  uniform float uDistortionStrength;
  varying vec2 vUv;

  vec2 backgroundCoverUv(vec2 screenSize, vec2 imageSize, vec2 uv) {
    float screenRatio = screenSize.x / screenSize.y;
    float imageRatio = imageSize.x / imageSize.y;

    vec2 newSize = screenRatio < imageRatio
      ? vec2(imageSize.x * screenSize.y / imageSize.y, screenSize.y)
      : vec2(screenSize.x, imageSize.y * screenSize.x / imageSize.x);

    vec2 newOffset = (screenRatio < imageRatio
      ? vec2((newSize.x - screenSize.x) / 2.0, 0.0)
      : vec2(0.0, (newSize.y - screenSize.y) / 2.0)) / newSize;

    return uv * screenSize / newSize + newOffset;
  }

  void main() {
    vec2 uv = vUv;
    vec2 texUv = uImageSize.x > 0.0 && uImageSize.y > 0.0
      ? backgroundCoverUv(uMeshSize, uImageSize, uv)
      : uv;

    vec2 texelSize = vec2(1.0 / 64.0);
    float hL = texture2D(uDisplacementMap, uv - vec2(texelSize.x, 0.0)).r;
    float hR = texture2D(uDisplacementMap, uv + vec2(texelSize.x, 0.0)).r;
    float hT = texture2D(uDisplacementMap, uv - vec2(0.0, texelSize.y)).r;
    float hB = texture2D(uDisplacementMap, uv + vec2(0.0, texelSize.y)).r;
    vec2 mouseNormalOffset = vec2(hL - hR, hT - hB);

    vec2 distortion = mouseNormalOffset * uDistortionStrength;
    vec2 texCenter = vec2(0.5);
    vec2 texScale = (texUv - texCenter) * uScale + texCenter;
    vec2 sampleUv = clamp(texScale + distortion, 0.002, 0.998);
    vec4 textureColor = texture2D(uTexture, sampleUv);
    textureColor.rgb *= clamp(1.0 - length(mouseNormalOffset) * 0.38, 0.74, 1.0);

    gl_FragColor = textureColor;
  }
`;

const createRenderTarget = () => (
  new THREE.WebGLRenderTarget(64, 64, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.HalfFloatType,
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
    depthBuffer: false,
    stencilBuffer: false,
  })
);

const useTextureImage = (src) => {
  const [loadState, setLoadState] = useState(() => ({
    src,
    texture: getLiquidProjectTexture(src),
    failed: false,
  }));

  useEffect(() => {
    const cachedTexture = getLiquidProjectTexture(src);
    if (cachedTexture) return undefined;

    return loadLiquidProjectTexture(
      src,
      (texture) => setLoadState({ src, texture, failed: false }),
      () => setLoadState({ src, texture: null, failed: true }),
    );
  }, [src]);

  return loadState.src === src
    ? { texture: loadState.texture, failed: loadState.failed }
    : { texture: null, failed: false };
};

const FromAnotherPlane = ({ src, enabled, onReady, onFail }) => {
  const meshRef = useRef(null);
  const imageMaterialRef = useRef(null);
  const simMaterialRef = useRef(null);
  const mouseRef = useRef(new THREE.Vector2(-10, -10));
  const previousUvRef = useRef(new THREE.Vector2(0.5, 0.5));
  const isMouseOnMeshRef = useRef(false);
  const { texture, failed } = useTextureImage(src);
  const { gl, camera, raycaster, viewport } = useThree();

  const simulationScene = useMemo(() => new THREE.Scene(), []);
  const simulationCamera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), []);
  const renderTargetA = useMemo(() => createRenderTarget(), []);
  const renderTargetB = useMemo(() => createRenderTarget(), []);
  const currentTargetRef = useRef(renderTargetA);
  const targetsInitializedRef = useRef(false);

  const simUniforms = useMemo(() => ({
    uTexture: { value: null },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uDissipation: { value: 0.955 },
    uBrushRadius: { value: 0.038 },
    uVelocity: { value: 0 },
  }), []);

  const imageUniforms = useMemo(() => ({
    uTexture: { value: null },
    uDisplacementMap: { value: renderTargetA.texture },
    uMeshSize: { value: new THREE.Vector2(1, 1) },
    uImageSize: { value: new THREE.Vector2(1, 1) },
    uScale: { value: 1 },
    uDistortionStrength: { value: 0.16 },
  }), [renderTargetA]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      mouseRef.current.set(event.clientX, event.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (failed) onFail();
  }, [failed, onFail]);

  useEffect(() => {
    if (!texture || !imageMaterialRef.current) return;
    const uniforms = imageMaterialRef.current.uniforms;
    uniforms.uTexture.value = texture;
    if (texture.image?.naturalWidth && texture.image?.naturalHeight) {
      uniforms.uImageSize.value.set(texture.image.naturalWidth, texture.image.naturalHeight);
    } else if (texture.image?.width && texture.image?.height) {
      uniforms.uImageSize.value.set(texture.image.width, texture.image.height);
    }
    onReady();
  }, [onReady, texture]);

  useEffect(() => () => {
    renderTargetA.dispose();
    renderTargetB.dispose();
  }, [renderTargetA, renderTargetB]);

  useFrame(() => {
    if (!texture || !meshRef.current || !imageMaterialRef.current || !simMaterialRef.current) return;

    const previousRenderTarget = gl.getRenderTarget();
    if (!targetsInitializedRef.current) {
      gl.setRenderTarget(renderTargetA);
      gl.clear();
      gl.setRenderTarget(renderTargetB);
      gl.clear();
      gl.setRenderTarget(previousRenderTarget);
      targetsInitializedRef.current = true;
    }

    const mesh = meshRef.current;
    const rect = gl.domElement.getBoundingClientRect();
    const normalizedMouse = new THREE.Vector2(
      ((mouseRef.current.x - rect.left) / rect.width) * 2 - 1,
      -(((mouseRef.current.y - rect.top) / rect.height) * 2 - 1),
    );

    raycaster.setFromCamera(normalizedMouse, camera);
    const hits = raycaster.intersectObject(mesh);

    if (enabled && hits.length && hits[0].uv) {
      const uv = hits[0].uv;
      const currentUv = new THREE.Vector2(uv.x, uv.y);
      const velocity = isMouseOnMeshRef.current
        ? Math.min(currentUv.distanceTo(previousUvRef.current) * 48, 0.85)
        : 0;

      simMaterialRef.current.uniforms.uMouse.value.copy(currentUv);
      simMaterialRef.current.uniforms.uVelocity.value = velocity;
      previousUvRef.current.copy(currentUv);
      isMouseOnMeshRef.current = true;
    } else {
      simMaterialRef.current.uniforms.uVelocity.value = 0;
      isMouseOnMeshRef.current = false;
    }

    const writeTarget = currentTargetRef.current === renderTargetA ? renderTargetA : renderTargetB;
    const readTarget = currentTargetRef.current === renderTargetA ? renderTargetB : renderTargetA;
    simMaterialRef.current.uniforms.uTexture.value = readTarget.texture;

    gl.setRenderTarget(writeTarget);
    gl.render(simulationScene, simulationCamera);
    gl.setRenderTarget(previousRenderTarget);

    imageMaterialRef.current.uniforms.uDisplacementMap.value = writeTarget.texture;
    imageMaterialRef.current.uniforms.uMeshSize.value.set(viewport.width, viewport.height);

    currentTargetRef.current = readTarget;
  });

  if (!texture) return null;

  return (
    <>
      <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry args={[1, 1, 64, 64]} />
        <shaderMaterial
          ref={imageMaterialRef}
          vertexShader={imageVertexShader}
          fragmentShader={imageFragmentShader}
          uniforms={imageUniforms}
          transparent={false}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>
      {createPortal(
        <mesh>
          <planeGeometry args={[2, 2]} />
          <shaderMaterial
            ref={simMaterialRef}
            vertexShader={passVertexShader}
            fragmentShader={simulationFragmentShader}
            uniforms={simUniforms}
          />
        </mesh>,
        simulationScene,
      )}
    </>
  );
};

const LiquidProjectImage = ({
  src,
  alt = 'Project Image',
  className = '',
  isInteractive = true,
  effectEnabled = true,
}) => {
  const [webglState, setWebglState] = useState({ src: null, contextLost: false, shaderReady: false });
  const contextLost = webglState.src === src && webglState.contextLost;
  const shaderReady = webglState.src === src && webglState.shaderReady;

  if (!isInteractive || contextLost) {
    return (
      <img
        src={src}
        alt={alt}
        className={`object-cover ${className}`}
        loading="lazy"
        draggable={false}
      />
    );
  }

  return (
    <div
      className={`liquid-project-image ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: '28px',
        backgroundColor: '#e5e7eb',
      }}
    >
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
        decoding="async"
        draggable={false}
      />
      <Canvas
        dpr={[1, 1.35]}
        camera={{ position: [0, 0, 1], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener(
            'webglcontextlost',
            () => setWebglState({ src, contextLost: true, shaderReady: false }),
            { once: true },
          );
        }}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          opacity: shaderReady ? 1 : 0,
          pointerEvents: 'none',
        }}
      >
        <FromAnotherPlane
          src={src}
          enabled={effectEnabled}
          onReady={() => setWebglState({ src, contextLost: false, shaderReady: true })}
          onFail={() => setWebglState({ src, contextLost: true, shaderReady: false })}
        />
      </Canvas>
    </div>
  );
};

export default LiquidProjectImage;

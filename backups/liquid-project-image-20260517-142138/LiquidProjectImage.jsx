import { useCallback, useEffect, useRef } from 'react';

const getCoverRect = (image, width, height) => {
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const canvasRatio = width / height;

  if (canvasRatio > imageRatio) {
    const drawWidth = width;
    const drawHeight = width / imageRatio;
    return {
      x: 0,
      y: (height - drawHeight) / 2,
      width: drawWidth,
      height: drawHeight,
    };
  }

  const drawHeight = height;
  const drawWidth = height * imageRatio;
  return {
    x: (width - drawWidth) / 2,
    y: 0,
    width: drawWidth,
    height: drawHeight,
  };
};

const drawCoverImage = (ctx, image, width, height) => {
  const rect = getCoverRect(image, width, height);
  ctx.drawImage(image, rect.x, rect.y, rect.width, rect.height);
};

const waveOffset = (time, seed) => Math.sin(time * 0.004 + seed * 2.7);

const LiquidProjectImage = ({ src, alt = 'Project Image', className = '' }) => {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const frameRef = useRef(null);
  const sizeRef = useRef({ width: 1, height: 1, dpr: 1 });
  const pointerRef = useRef({ x: 0.5, y: 0.5, inside: false });
  const previousPointerRef = useRef({ x: 0.5, y: 0.5 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const ripplesRef = useRef([]);
  const motionRef = useRef(0);
  const timeRef = useRef(0);

  const resizeCanvas = useCallback(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const rect = wrapper.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.35);
    const width = Math.max(rect.width, 1);
    const height = Math.max(rect.height, 1);

    sizeRef.current = { width, height, dpr };
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }, []);

  const updatePointer = useCallback((event) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    const inside = (
      event.clientX >= rect.left
      && event.clientX <= rect.right
      && event.clientY >= rect.top
      && event.clientY <= rect.bottom
    );

    if (!inside) {
      pointerRef.current.inside = false;
      return;
    }

    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const prev = previousPointerRef.current;
    const dx = x - prev.x;
    const dy = y - prev.y;
    const speed = Math.min(Math.hypot(dx, dy) * 18, 1);

    pointerRef.current = { x, y, inside: true };
    previousPointerRef.current = { x, y };
    velocityRef.current = {
      x: velocityRef.current.x * 0.58 + dx * 0.42,
      y: velocityRef.current.y * 0.58 + dy * 0.42,
    };
    motionRef.current = Math.max(motionRef.current, 0.28 + speed * 0.7);

    if (speed > 0.008) {
      ripplesRef.current.push({
        x,
        y,
        vx: dx,
        vy: dy,
        life: 1,
        size: 0.045 + speed * 0.075,
        strength: 1.05 + speed * 0.95,
      });
      if (ripplesRef.current.length > 10) {
        ripplesRef.current.shift();
      }
    }
  }, []);

  const drawLiquidPatch = useCallback((ctx, image, width, height, patch, time, coverRect) => {
    const px = patch.x * width;
    const py = patch.y * height;
    const velocity = {
      x: patch.vx || velocityRef.current.x,
      y: patch.vy || velocityRef.current.y,
    };
    const velocityLength = Math.max(Math.hypot(velocity.x, velocity.y), 0.0001);
    const dirX = velocity.x / velocityLength;
    const dirY = velocity.y / velocityLength;
    const normalX = -dirY;
    const normalY = dirX;
    const radius = Math.min(width, height) * patch.size;
    const strength = patch.strength * patch.life;
    const phase = time * 0.006;

    if (strength <= 0.01 || radius < 4) return;

    ctx.save();
    ctx.beginPath();
    ctx.ellipse(px, py, radius * 1.25, radius * 0.82, Math.atan2(dirY, dirX), 0, Math.PI * 2);
    ctx.clip();

    const angle = Math.atan2(dirY, dirX);
    const bandWidth = Math.max(10, radius * (0.2 + patch.life * 0.06));
    const waveSegments = 5;

    for (let i = 0; i < waveSegments; i += 1) {
      const segmentAngle = angle + (i / waveSegments) * Math.PI * 2 + Math.sin(phase + i) * 0.16;
      const segmentSpan = 0.34 + Math.sin(phase * 0.7 + i * 1.9) * 0.08;
      const outerRadius = radius + bandWidth * 0.5;
      const innerRadius = Math.max(2, radius - bandWidth * 0.5);
      const start = segmentAngle - segmentSpan;
      const end = segmentAngle + segmentSpan;
      const push = (18 + Math.sin(phase + i * 2.1) * 7) * strength;

      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, outerRadius, start, end);
      ctx.arc(px, py, innerRadius, end, start, true);
      ctx.closePath();
      ctx.clip();
      ctx.globalAlpha = Math.min(0.62, 0.16 + strength * 0.44);
      ctx.translate(Math.cos(segmentAngle) * push, Math.sin(segmentAngle) * push);
      ctx.drawImage(image, coverRect.x, coverRect.y, coverRect.width, coverRect.height);
      ctx.restore();
    }

    const layers = 2;
    for (let i = layers; i >= 1; i -= 1) {
      const t = i / layers;
      const layerRadius = radius * t;
      const wave = Math.sin(phase + t * 18.0 + patch.life * 4.0);
      const wake = (1 - t) * strength * 0.7;
      const pull = 28 * wake;
      const swirl = wave * 17 * wake;
      const scale = 1 + (0.026 * wake * (1 - t * 0.25));
      const offsetX = (-dirX * pull) + (normalX * swirl);
      const offsetY = (-dirY * pull) + (normalY * swirl);

      ctx.save();
      ctx.beginPath();
      const angle = Math.atan2(dirY, dirX);
      const blobX = px + normalX * Math.sin(phase + i * 1.7) * radius * 0.08;
      const blobY = py + normalY * Math.cos(phase + i * 1.3) * radius * 0.08;
      ctx.ellipse(
        blobX,
        blobY,
        layerRadius * (1.04 + Math.sin(phase + i) * 0.08),
        layerRadius * (0.72 + Math.cos(phase + i * 1.4) * 0.07),
        angle + Math.sin(phase + t * 4.0) * 0.12,
        0,
        Math.PI * 2,
      );
      ctx.clip();
      ctx.globalAlpha = Math.min(0.56, 0.14 + wake * 0.48);
      ctx.translate(px + offsetX, py + offsetY);
      ctx.scale(scale, scale);
      ctx.translate(-px, -py);
      ctx.drawImage(image, coverRect.x, coverRect.y, coverRect.width, coverRect.height);
      ctx.restore();
    }

    ctx.globalCompositeOperation = 'screen';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (let i = 0; i < 2; i += 1) {
      const offset = (i - 1.5) * radius * 0.16;
      const length = radius * (0.42 + i * 0.08);
      const startX = px - dirX * length * 0.65 + normalX * offset;
      const startY = py - dirY * length * 0.65 + normalY * offset;
      const endX = px + dirX * length * 0.35 + normalX * offset * 0.35;
      const endY = py + dirY * length * 0.35 + normalY * offset * 0.35;
      const controlX = px + normalX * waveOffset(time, i) * radius * 0.24 - dirX * radius * 0.1;
      const controlY = py + normalY * waveOffset(time, i + 2) * radius * 0.24 - dirY * radius * 0.1;

      ctx.strokeStyle = `rgba(255,255,255,${0.09 * strength * (1 - i * 0.12)})`;
      ctx.lineWidth = Math.max(1, radius * (0.008 + i * 0.002));
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(controlX, controlY, endX, endY);
      ctx.stroke();
    }

    ctx.restore();
  }, []);

  const drawLiquidLens = useCallback((ctx, image, width, height, strength, time) => {
    const pointer = pointerRef.current;
    const coverRect = getCoverRect(image, width, height);
    const patches = ripplesRef.current;

    if (pointer.inside && strength > 0.05) {
      drawLiquidPatch(ctx, image, width, height, {
        x: pointer.x,
        y: pointer.y,
        vx: velocityRef.current.x,
        vy: velocityRef.current.y,
        life: Math.min(strength, 0.68),
        size: 0.095 + strength * 0.045,
        strength: 0.72 + strength * 0.45,
      }, time, coverRect);
    }

    for (let i = patches.length - 1; i >= 0; i -= 1) {
      drawLiquidPatch(ctx, image, width, height, patches[i], time, coverRect);
      patches[i].life *= 0.91;
      patches[i].size += 0.015 + (1 - patches[i].life) * 0.004;
      if (patches[i].life < 0.025) {
        patches.splice(i, 1);
      }
    }
  }, [drawLiquidPatch]);

  useEffect(() => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      imageRef.current = image;
      resizeCanvas();
    };
    image.src = src;

    return () => {
      image.onload = null;
    };
  }, [resizeCanvas, src]);

  useEffect(() => {
    resizeCanvas();

    const wrapper = wrapperRef.current;
    const resizeObserver = typeof ResizeObserver !== 'undefined' && wrapper
      ? new ResizeObserver(resizeCanvas)
      : null;

    resizeObserver?.observe(wrapper);
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('pointermove', updatePointer, { passive: true });
    const handlePointerLeave = () => {
      pointerRef.current.inside = false;
    };

    const renderFrame = (time = 0) => {
      const canvas = canvasRef.current;
      const image = imageRef.current;

      if (canvas && image?.complete && image.naturalWidth) {
        const { width, height, dpr } = sizeRef.current;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          timeRef.current = time;
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.clearRect(0, 0, width, height);
          drawCoverImage(ctx, image, width, height);
          drawLiquidLens(ctx, image, width, height, motionRef.current, timeRef.current);
          motionRef.current *= pointerRef.current.inside ? 0.91 : 0.84;
        }
      }

      frameRef.current = requestAnimationFrame(renderFrame);
    };

    window.addEventListener('pointerleave', handlePointerLeave);

    frameRef.current = requestAnimationFrame(renderFrame);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointermove', updatePointer);
      window.removeEventListener('pointerleave', handlePointerLeave);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [drawLiquidLens, resizeCanvas, updatePointer]);

  return (
    <div
      ref={wrapperRef}
      className={`liquid-project-image ${className}`}
      data-cursor-type="project"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: '28px',
        backgroundColor: '#e5e7eb',
      }}
    >
      <canvas
        ref={canvasRef}
        aria-label={alt}
        role="img"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

export default LiquidProjectImage;

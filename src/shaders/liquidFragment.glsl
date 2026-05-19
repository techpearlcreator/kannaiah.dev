uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uPrevMouse;
uniform float uVelocity;
uniform float uHover;
uniform float uStrength;
uniform vec2 uResolution;

varying vec2 vUv;

// --- NOISE FUNCTIONS ---
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
  m = m*m;
  m = m*m;
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
  
  // 1. MOUSE DISTORTION FORCE
  float mouseDistance = distance(uv, uMouse);
  float mouseForce = smoothstep(0.4, 0.0, mouseDistance);
  
  // 2. LIQUID DISPLACEMENT MATH
  // Idle movement (Perlin Noise)
  float noise = snoise(uv * 3.0 + uTime * 0.2);
  
  // Dynamic displacement influenced by velocity and hover
  vec2 displacement = vec2(noise) * 0.03 * (1.0 + uHover * 0.5);
  
  // Mouse trail / wake distortion
  vec2 mouseDir = normalize(uMouse - uPrevMouse + 0.0001);
  displacement += mouseDir * mouseForce * uVelocity * 0.15 * uHover;
  
  // 3. APPLY DISTORTION TO UV
  vec2 distortedUv = uv + displacement * uStrength;
  
  // 4. SUBTLE RGB SPLIT (Refraction)
  float aberrationAmount = uVelocity * 0.02 * uHover;
  float r = texture2D(uTexture, distortedUv + vec2(aberrationAmount, 0.0)).r;
  float g = texture2D(uTexture, distortedUv).g;
  float b = texture2D(uTexture, distortedUv - vec2(aberrationAmount, 0.0)).b;
  
  vec3 color = vec3(r, g, b);
  
  // 5. GLASS REFLECTION / SPECULAR SWEEP
  float reflection = smoothstep(0.4, 0.5, distortedUv.x + distortedUv.y - fract(uTime * 0.1) * 2.0);
  color += reflection * 0.05 * uHover;
  
  // Subtle brightness boost on hover
  color += uHover * 0.03;

  gl_FragColor = vec4(color, 1.0);
}

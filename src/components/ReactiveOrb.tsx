import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./ReactiveOrb.css";

interface ReactiveOrbProps {
  activity: number;
  isUserSpeaking: boolean;
  isAssistantSpeaking: boolean;
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uActivity;
  uniform float uSpeak;

  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying float vDisp;

  float ripple(vec3 p, float t) {
    float w1 = sin(p.x * 3.2 + t * 1.4) * sin(p.y * 2.8 - t * 1.1);
    float w2 = sin(p.z * 3.5 + t * 0.9) * cos(p.x * 2.1 + t * 0.7);
    float w3 = cos(p.y * 3.8 - t * 1.3) * sin(p.z * 2.4 + t * 1.6);
    return (w1 + w2 + w3) / 3.0;
  }

  void main() {
    vec3 n = normalize(normalMatrix * normal);
    float t = uTime;
    float energy = 0.12 + uActivity * 0.42 + uSpeak * 0.28;
    float disp = ripple(position, t) * energy;
    vec3 displaced = position + normal * disp;

    vNormal = normalize(normalMatrix * normal);
    vWorldPos = (modelMatrix * vec4(displaced, 1.0)).xyz;
    vDisp = disp;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uActivity;
  uniform float uSpeak;

  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying float vDisp;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.2);

    float t = uTime * 0.7;
    float band1 = sin(vWorldPos.x * 3.8 + t + vDisp * 10.0) * 0.5 + 0.5;
    float band2 = cos(vWorldPos.y * 4.2 - t * 1.1 + vWorldPos.z * 2.0) * 0.5 + 0.5;
    float band3 = sin(vWorldPos.z * 3.5 + t * 0.85) * cos(vWorldPos.x * 2.5 - t * 0.6) * 0.5 + 0.5;
    float palette = fract(band1 * 0.35 + band2 * 0.35 + band3 * 0.3 + fresnel * 0.15);

    vec3 white   = vec3(0.97, 0.96, 0.98);
    vec3 pink    = vec3(1.0, 0.22, 0.58);
    vec3 magenta = vec3(0.88, 0.1, 0.72);
    vec3 violet  = vec3(0.58, 0.22, 1.0);
    vec3 cyan    = vec3(0.12, 0.78, 1.0);
    vec3 teal    = vec3(0.1, 0.92, 0.78);
    vec3 lime    = vec3(0.55, 1.0, 0.35);
    vec3 yellow  = vec3(1.0, 0.92, 0.35);
    vec3 orange  = vec3(1.0, 0.52, 0.18);
    vec3 coral   = vec3(1.0, 0.38, 0.42);

    vec3 color;
    if (palette < 0.14)       color = mix(pink, magenta, palette / 0.14);
    else if (palette < 0.28)  color = mix(magenta, violet, (palette - 0.14) / 0.14);
    else if (palette < 0.42)  color = mix(violet, cyan, (palette - 0.28) / 0.14);
    else if (palette < 0.56)  color = mix(cyan, teal, (palette - 0.42) / 0.14);
    else if (palette < 0.68)  color = mix(teal, lime, (palette - 0.56) / 0.12);
    else if (palette < 0.80)  color = mix(lime, yellow, (palette - 0.68) / 0.12);
    else if (palette < 0.90)  color = mix(yellow, orange, (palette - 0.80) / 0.10);
    else                      color = mix(orange, coral, (palette - 0.90) / 0.10);

    float energy = 0.5 + uActivity * 0.3 + uSpeak * 0.2;
    color = mix(white, color, energy);
    color = mix(color, mix(violet, cyan, band2), fresnel * 0.25);
    color += fresnel * mix(yellow, pink, band3) * (0.12 + uActivity * 0.2 + uSpeak * 0.15);

    float alpha = smoothstep(0.95, 0.2, fresnel) * 0.88;
    gl_FragColor = vec4(color, alpha);
  }
`;

export function ReactiveOrb({
  activity,
  isUserSpeaking,
  isAssistantSpeaking,
}: ReactiveOrbProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const activityRef = useRef(activity);
  const userRef = useRef(isUserSpeaking);
  const assistantRef = useRef(isAssistantSpeaking);

  activityRef.current = activity;
  userRef.current = isUserSpeaking;
  assistantRef.current = isAssistantSpeaking;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const ORB_BASE_SIZE = 380;
    let viewportScale = 1;

    const updateViewportScale = () => {
      const size = Math.min(mount.clientWidth, mount.clientHeight);
      viewportScale = size / ORB_BASE_SIZE;
    };

    updateViewportScale();
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.z = 4.4;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(0.82, 64);
    const uniforms = {
      uTime: { value: 0 },
      uActivity: { value: 0 },
      uSpeak: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
    });

    const orb = new THREE.Mesh(geometry, material);
    scene.add(orb);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(2, 2, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x66ccff, 0.8);
    rimLight.position.set(-3, -1, 2);
    scene.add(rimLight);

    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambient);

    let raf = 0;
    const clock = new THREE.Clock();
    let smoothActivity = 0;
    let smoothSpeak = 0;

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      const targetActivity = activityRef.current;
      const targetSpeak = assistantRef.current
        ? 0.65 + Math.sin(elapsed * 9) * 0.25
        : userRef.current
          ? targetActivity
          : 0.08 + Math.sin(elapsed * 1.2) * 0.04;

      smoothActivity += (targetActivity - smoothActivity) * 0.12;
      smoothSpeak += (targetSpeak - smoothSpeak) * 0.14;

      uniforms.uTime.value = elapsed;
      uniforms.uActivity.value = smoothActivity;
      uniforms.uSpeak.value = assistantRef.current ? smoothSpeak : 0;

      const wobble = smoothActivity * 0.35 + smoothSpeak * 0.2;
      orb.rotation.x = Math.sin(elapsed * 0.35) * 0.12 * wobble;
      orb.rotation.y = elapsed * (0.18 + smoothActivity * 0.25);
      orb.rotation.z = Math.cos(elapsed * 0.28) * 0.08 * wobble;

      const pulse = 1 + smoothActivity * 0.06 + smoothSpeak * 0.04;
      orb.scale.setScalar(viewportScale * pulse);

      const driftX = Math.sin(elapsed * 0.55) * 0.05 * wobble;
      const driftY = Math.cos(elapsed * 0.42) * 0.04 * wobble;
      orb.position.set(driftX, driftY, 0);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };

    animate();

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      updateViewportScale();
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const observer = new ResizeObserver(onResize);
    observer.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="reactive-orb-wrap">
      <div ref={mountRef} className="reactive-orb" aria-hidden />
      <div className="reactive-orb__glow" aria-hidden />
    </div>
  );
}

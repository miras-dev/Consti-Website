import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeSculptureProps {
  activeIndex: number;
  className?: string;
}

const COLORS = [
  0xc9a84c, // Financial Planning - gold
  0x4a7fb5, // Investment & ETFs - blue
  0x2e7d6b, // Retirement - green
  0x8b3a4e, // Insurance - deep red
  0x5a4a7f, // Career - purple
  0x2d5a3d, // Tax - forest
  0xc97a3a, // Salary - amber
  0x2d4a7f, // Internationals - navy
  0x3d7f2d, // Sustainable - eco
];

const SPEEDS = [0.5, 1.2, 0.3, 0.8, 1.5, 0.4, 2.0, 1.0, 0.7];

export default function ThreeSculpture({ activeIndex, className = "" }: ThreeSculptureProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    frameId: 0,
    targetSpeed: 1.0,
    targetColor: new THREE.Color(0xc9a84c),
    currentColor: new THREE.Color(0xc9a84c),
    coreMat: null as THREE.MeshStandardMaterial | null,
    wireMat: null as THREE.MeshBasicMaterial | null,
  });

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const w = el.clientWidth || 400;
    const h = el.clientHeight || 400;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.set(0, 0, 5);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dirLight = new THREE.DirectionalLight(0xc9a84c, 1.5);
    dirLight.position.set(3, 5, 5);
    scene.add(dirLight);
    const rimLight = new THREE.DirectionalLight(0x4466ff, 0.5);
    rimLight.position.set(-3, -2, -2);
    scene.add(rimLight);

    const coreMat = new THREE.MeshStandardMaterial({ color: 0xc9a84c, metalness: 0.8, roughness: 0.2 });
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.9, 1), coreMat);
    scene.add(core);

    const wireMat = new THREE.MeshBasicMaterial({ color: 0xc9a84c, wireframe: true, transparent: true, opacity: 0.12 });
    const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(0.93, 2), wireMat);
    scene.add(wire);

    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(1.6, 0.012, 8, 80),
      new THREE.MeshStandardMaterial({ color: 0xc9a84c, metalness: 0.9, roughness: 0.1 })
    );
    ring1.rotation.x = Math.PI / 4;
    scene.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.1, 0.008, 8, 100),
      new THREE.MeshStandardMaterial({ color: 0x131b2e, metalness: 0.6, roughness: 0.3 })
    );
    ring2.rotation.x = -Math.PI / 3;
    ring2.rotation.z = Math.PI / 5;
    scene.add(ring2);

    const satGeo = new THREE.SphereGeometry(0.06, 12, 12);
    const satellites = Array.from({ length: 6 }, () => {
      const m = new THREE.Mesh(satGeo, new THREE.MeshStandardMaterial({ color: 0xc9a84c, metalness: 1, roughness: 0 }));
      scene.add(m);
      return m;
    });

    const pCount = 200;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const r = 2.5 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPos[i * 3 + 2] = r * Math.cos(phi);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0xc9a84c, size: 0.03, transparent: true, opacity: 0.6 });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    stateRef.current.coreMat = coreMat;
    stateRef.current.wireMat = wireMat;

    let t = 0;
    let alive = true;

    const animate = () => {
      if (!alive) return;
      stateRef.current.frameId = requestAnimationFrame(animate);

      const { targetSpeed, targetColor, currentColor } = stateRef.current;
      t += 0.008 * targetSpeed;

      currentColor.lerp(targetColor, 0.025);
      coreMat.color.copy(currentColor);
      wireMat.color.copy(currentColor);

      core.rotation.y = t * 0.6;
      core.rotation.x = Math.sin(t * 0.3) * 0.3;
      wire.rotation.copy(core.rotation);

      ring1.rotation.z = t * 0.4;
      ring2.rotation.y = t * 0.3;
      ring2.rotation.x = -Math.PI / 3 + Math.sin(t * 0.2) * 0.1;

      satellites.forEach((sat, i) => {
        const angle = t * (0.8 + i * 0.15) + (i * Math.PI * 2) / 6;
        sat.position.set(Math.cos(angle) * 1.6, Math.sin(angle * 0.5) * 0.5, Math.sin(angle) * 1.6);
      });

      particles.rotation.y = t * 0.05;
      particles.rotation.x = t * 0.02;

      camera.position.x = Math.sin(t * 0.1) * 0.3;
      camera.position.y = Math.cos(t * 0.08) * 0.2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      alive = false;
      cancelAnimationFrame(stateRef.current.frameId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      stateRef.current.coreMat = null;
      stateRef.current.wireMat = null;
    };
  }, []);

  useEffect(() => {
    stateRef.current.targetSpeed = SPEEDS[activeIndex] ?? 1.0;
    stateRef.current.targetColor.set(COLORS[activeIndex] ?? 0xc9a84c);
  }, [activeIndex]);

  return <div ref={mountRef} className={`w-full h-full ${className}`} />;
}

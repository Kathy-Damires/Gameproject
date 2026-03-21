// @ts-nocheck
import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Float, Html } from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════
   PLANET SPHERE — rotating with atmosphere
   ═══════════════════════════════════════════ */
function Planet({ color, size = 2 }: { color: string; size?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const atmosRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.08;
    if (atmosRef.current) atmosRef.current.rotation.y -= delta * 0.03;
  });

  const mainColor = new THREE.Color(color);
  const darkColor = mainColor.clone().multiplyScalar(0.4);

  return (
    <group>
      {/* Planet body */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial
          color={mainColor}
          roughness={0.7}
          metalness={0.1}
          emissive={mainColor}
          emissiveIntensity={0.15}
        />
      </mesh>
      {/* Atmosphere glow */}
      <mesh ref={atmosRef} scale={1.12}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshBasicMaterial
          color={mainColor}
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Ring / orbit line */}
      <mesh rotation={[Math.PI * 0.45, 0.2, 0]}>
        <torusGeometry args={[size * 1.3, 0.015, 16, 100]} />
        <meshBasicMaterial color={mainColor} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════
   STRUCTURE — 3D building on planet surface
   ═══════════════════════════════════════════ */
interface StructureProps {
  name: string;
  level: number;
  rate: number;
  resourceName: string;
  color: string;
  position: [number, number, number];
  type: "quarry" | "lumber" | "farm" | "forge" | "generator" | "temple";
}

function Structure({ name, level, rate, resourceName, color, position, type }: StructureProps) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const structColor = new THREE.Color(color);

  useFrame((state) => {
    if (glowRef.current) {
      glowRef.current.intensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  const height = 0.15 + level * 0.04;

  return (
    <group ref={groupRef} position={position}>
      {/* Base platform */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 0.06, 8]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Main building body */}
      {type === "quarry" || type === "forge" ? (
        <mesh position={[0, height / 2 + 0.03, 0]}>
          <boxGeometry args={[0.2, height, 0.2]} />
          <meshStandardMaterial color={structColor} roughness={0.5} metalness={0.3}
            emissive={structColor} emissiveIntensity={0.2} />
        </mesh>
      ) : type === "temple" ? (
        <group position={[0, 0.03, 0]}>
          <mesh position={[0, height * 0.3, 0]}>
            <cylinderGeometry args={[0.15, 0.18, height * 0.6, 6]} />
            <meshStandardMaterial color={structColor} roughness={0.4} metalness={0.4}
              emissive={structColor} emissiveIntensity={0.15} />
          </mesh>
          <mesh position={[0, height * 0.7, 0]}>
            <coneGeometry args={[0.17, height * 0.4, 6]} />
            <meshStandardMaterial color={structColor} roughness={0.4} metalness={0.3}
              emissive={structColor} emissiveIntensity={0.2} />
          </mesh>
        </group>
      ) : type === "generator" ? (
        <group position={[0, 0.03, 0]}>
          <mesh position={[0, height * 0.4, 0]}>
            <cylinderGeometry args={[0.1, 0.14, height * 0.8, 12]} />
            <meshStandardMaterial color={structColor} roughness={0.2} metalness={0.7}
              emissive={structColor} emissiveIntensity={0.4} />
          </mesh>
          <mesh position={[0, height * 0.85, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1}
              transparent opacity={0.8} />
          </mesh>
        </group>
      ) : (
        /* lumber, farm, default */
        <group position={[0, 0.03, 0]}>
          <mesh position={[0, height * 0.35, 0]}>
            <boxGeometry args={[0.22, height * 0.7, 0.16]} />
            <meshStandardMaterial color={structColor} roughness={0.6} metalness={0.2}
              emissive={structColor} emissiveIntensity={0.1} />
          </mesh>
          <mesh position={[0, height * 0.75, 0]}>
            <coneGeometry args={[0.16, height * 0.3, 4]} />
            <meshStandardMaterial color={structColor.clone().multiplyScalar(0.7)}
              roughness={0.5} metalness={0.2} />
          </mesh>
        </group>
      )}

      {/* Glow light */}
      <pointLight ref={glowRef} position={[0, height + 0.1, 0]}
        color={color} intensity={0.5} distance={1} />

      {/* Floating label */}
      <Html position={[0, height + 0.25, 0]} center distanceFactor={6}
        style={{ pointerEvents: "none" }}>
        <div className="flex flex-col items-center gap-0.5 select-none">
          <div className="px-2 py-0.5 rounded-lg text-[8px] font-bold text-white whitespace-nowrap"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", border: `1px solid ${color}40` }}>
            {name} <span className="text-white/50">Nv.{level}</span>
          </div>
          <div className="px-1.5 py-0.5 rounded text-[7px] font-bold whitespace-nowrap"
            style={{ background: "rgba(0,200,100,0.2)", color: "#4ade80" }}>
            +{rate}/s
          </div>
        </div>
      </Html>
    </group>
  );
}

/* ═══════════════════════════════════════════
   SKIN DEFINITIONS
   ═══════════════════════════════════════════ */
export interface SkinDef {
  id: string;
  name: string;
  body: string;
  bodyEmissive: string;
  head: string;
  headEmissive: string;
  visor: string;
  glow: string;
  shoulderPads?: boolean;
  cape?: string;
  wings?: boolean;
  aura?: string;
}

export const SKINS: SkinDef[] = [
  { id: "default", name: "Default", body: "#1a5276", bodyEmissive: "#2196f3", head: "#2196f3", headEmissive: "#64b5f6", visor: "#00e5ff", glow: "#00e5ff" },
  { id: "bronze_warrior", name: "Guerrero de Bronce", body: "#8B4513", bodyEmissive: "#CD7F32", head: "#CD7F32", headEmissive: "#DAA520", visor: "#FFD700", glow: "#DAA520", shoulderPads: true },
  { id: "dark_knight", name: "Caballero Oscuro", body: "#1a1a2e", bodyEmissive: "#4a0080", head: "#2d1b4e", headEmissive: "#7b2ff7", visor: "#bf00ff", glow: "#9b00ff", cape: "#4a0080" },
  { id: "mech_titan", name: "Titán Mecánico", body: "#37474F", bodyEmissive: "#00BCD4", head: "#455A64", headEmissive: "#00E5FF", visor: "#00FFFF", glow: "#00BCD4", shoulderPads: true },
  { id: "solar_phoenix", name: "Fénix Solar", body: "#B71C1C", bodyEmissive: "#FF6F00", head: "#E65100", headEmissive: "#FFAB00", visor: "#FFD600", glow: "#FF6F00", wings: true, aura: "#FF9800" },
  { id: "quantum_ghost", name: "Fantasma Cuántico", body: "#0D47A1", bodyEmissive: "#00E5FF", head: "#01579B", headEmissive: "#80DEEA", visor: "#E0F7FA", glow: "#00E5FF", aura: "#00BCD4" },
];

/* ═══════════════════════════════════════════
   CHARACTER — Aris with skin support
   ═══════════════════════════════════════════ */
function Aris({ position, skin, onClick }: { position: [number, number, number]; skin: SkinDef; onClick?: () => void }) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
      // Slow spin when hovered/selected for skin preview
      if (hovered) {
        ref.current.rotation.y += 0.02;
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={0} floatIntensity={0.3}>
      <group ref={ref} position={position} scale={0.22}
        onClick={onClick}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = "default"; }}
        scale={hovered ? 1.3 : 1}>

        {/* Legs */}
        <mesh position={[-0.1, 0.3, 0]}>
          <capsuleGeometry args={[0.08, 0.4, 4, 8]} />
          <meshStandardMaterial color={skin.body} roughness={0.5} metalness={0.4} />
        </mesh>
        <mesh position={[0.1, 0.3, 0]}>
          <capsuleGeometry args={[0.08, 0.4, 4, 8]} />
          <meshStandardMaterial color={skin.body} roughness={0.5} metalness={0.4} />
        </mesh>

        {/* Body */}
        <mesh position={[0, 1.2, 0]}>
          <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
          <meshStandardMaterial color={skin.body} roughness={0.4} metalness={0.5}
            emissive={skin.bodyEmissive} emissiveIntensity={hovered ? 0.5 : 0.3} />
        </mesh>

        {/* Shoulder pads */}
        {skin.shoulderPads && (<>
          <mesh position={[-0.35, 1.5, 0]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshStandardMaterial color={skin.headEmissive} roughness={0.3} metalness={0.6}
              emissive={skin.headEmissive} emissiveIntensity={0.4} />
          </mesh>
          <mesh position={[0.35, 1.5, 0]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshStandardMaterial color={skin.headEmissive} roughness={0.3} metalness={0.6}
              emissive={skin.headEmissive} emissiveIntensity={0.4} />
          </mesh>
        </>)}

        {/* Cape */}
        {skin.cape && (
          <mesh position={[0, 1.1, -0.25]} rotation={[0.15, 0, 0]}>
            <boxGeometry args={[0.5, 0.9, 0.03]} />
            <meshStandardMaterial color={skin.cape} roughness={0.6} metalness={0.2}
              emissive={skin.cape} emissiveIntensity={0.2} transparent opacity={0.85} side={THREE.DoubleSide} />
          </mesh>
        )}

        {/* Wings */}
        {skin.wings && (<>
          <mesh position={[-0.4, 1.4, -0.15]} rotation={[0, -0.4, 0.3]}>
            <boxGeometry args={[0.5, 0.6, 0.02]} />
            <meshStandardMaterial color={skin.aura || skin.glow} roughness={0.2} metalness={0.3}
              emissive={skin.aura || skin.glow} emissiveIntensity={0.8} transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0.4, 1.4, -0.15]} rotation={[0, 0.4, -0.3]}>
            <boxGeometry args={[0.5, 0.6, 0.02]} />
            <meshStandardMaterial color={skin.aura || skin.glow} roughness={0.2} metalness={0.3}
              emissive={skin.aura || skin.glow} emissiveIntensity={0.8} transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>
        </>)}

        {/* Arms */}
        <mesh position={[-0.35, 1.1, 0]} rotation={[0, 0, 0.3]}>
          <capsuleGeometry args={[0.07, 0.5, 4, 8]} />
          <meshStandardMaterial color={skin.body} roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh position={[0.35, 1.1, 0]} rotation={[0, 0, -0.3]}>
          <capsuleGeometry args={[0.07, 0.5, 4, 8]} />
          <meshStandardMaterial color={skin.body} roughness={0.4} metalness={0.5} />
        </mesh>

        {/* Head */}
        <mesh position={[0, 2.1, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color={skin.head} roughness={0.3} metalness={0.4}
            emissive={skin.headEmissive} emissiveIntensity={hovered ? 0.6 : 0.4} />
        </mesh>

        {/* Visor */}
        <mesh position={[0, 2.1, 0.2]}>
          <sphereGeometry args={[0.12, 16, 16, 0, Math.PI]} />
          <meshStandardMaterial color={skin.visor} emissive={skin.visor} emissiveIntensity={0.8}
            transparent opacity={0.7} />
        </mesh>

        {/* Aura effect */}
        {skin.aura && (
          <mesh position={[0, 1.2, 0]}>
            <sphereGeometry args={[0.55, 16, 16]} />
            <meshBasicMaterial color={skin.aura} transparent opacity={hovered ? 0.15 : 0.06} side={THREE.BackSide} />
          </mesh>
        )}

        {/* Glow light */}
        <pointLight position={[0, 0.5, -0.3]} color={skin.glow} intensity={hovered ? 2 : 1} distance={2} />
        <pointLight position={[0, 2, 0.3]} color={skin.visor} intensity={0.5} distance={1.5} />

        {/* Name label on hover */}
        {hovered && (
          <Html position={[0, 2.8, 0]} center distanceFactor={6} style={{ pointerEvents: "none" }}>
            <div className="px-2 py-1 rounded-lg text-[9px] font-bold text-white whitespace-nowrap select-none"
              style={{ background: "rgba(0,0,0,0.8)", border: `1px solid ${skin.glow}60` }}>
              {skin.name}
            </div>
          </Html>
        )}
      </group>
    </Float>
  );
}

/* ═══════════════════════════════════════════
   FLOATING RESOURCE NUMBERS
   ═══════════════════════════════════════════ */
function FloatingNumber({ position, value, color }: {
  position: [number, number, number]; value: string; color: string;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.1;
    }
  });

  return (
    <group ref={ref} position={position}>
      <Html center distanceFactor={8} style={{ pointerEvents: "none" }}>
        <div className="text-sm font-bold select-none animate-pulse" style={{ color, textShadow: `0 0 8px ${color}` }}>
          +{value}
        </div>
      </Html>
    </group>
  );
}

/* ═══════════════════════════════════════════
   MAIN SCENE — Exported component
   ═══════════════════════════════════════════ */
export interface PlanetStructure3D {
  name: string;
  level: number;
  rate: number;
  resourceName: string;
  color: string;
  type: "quarry" | "lumber" | "farm" | "forge" | "generator" | "temple";
}

interface PlanetSceneProps {
  planetColor: string;
  planetName: string;
  structures: PlanetStructure3D[];
  totalRate: number;
  className?: string;
  currentSkinId?: string;
  onSkinChange?: (skinId: string) => void;
}

export default function PlanetScene({ planetColor, planetName, structures, totalRate, className, currentSkinId = "default", onSkinChange }: PlanetSceneProps) {
  const [showSkinSelector, setShowSkinSelector] = useState(false);
  const currentSkin = SKINS.find(s => s.id === currentSkinId) || SKINS[0];
  // Position structures around the planet surface
  const structurePositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    const count = structures.length;
    for (let i = 0; i < count; i++) {
      const angle = (i / Math.max(count, 1)) * Math.PI * 1.6 - Math.PI * 0.3;
      const x = Math.cos(angle) * 1.8;
      const z = Math.sin(angle) * 0.8;
      const y = 1.5 + Math.cos(angle * 0.7) * 0.15;
      positions.push([x, y, z]);
    }
    return positions;
  }, [structures.length]);

  return (
    <div className={className} style={{ width: "100%", height: "100%", minHeight: 300 }}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
        <directionalLight position={[-3, 2, -4]} intensity={0.3} color="#9b00ff" />
        <pointLight position={[0, 0, 3]} intensity={0.4} color={planetColor} />

        {/* Stars background */}
        <Stars radius={50} depth={30} count={1500} factor={3} saturation={0.5} fade speed={0.5} />

        <group position={[0, -0.3, 0]}>
          {/* Planet — smaller to fit */}
          <Planet color={planetColor} size={1.5} />

          {/* Aris character — click to open skin selector */}
          <Aris position={[0, 1.7, 1]} skin={currentSkin}
            onClick={() => setShowSkinSelector(true)} />

          {/* Structures around the planet */}
          {structures.map((s, i) => (
            <Structure
              key={s.name}
              name={s.name}
              level={s.level}
              rate={s.rate}
              resourceName={s.resourceName}
              color={s.color}
              position={structurePositions[i] || [0, 2, 0]}
              type={s.type}
            />
          ))}

          {/* Floating resource numbers */}
          <FloatingNumber position={[-1.5, 2.5, 0]} value={`${(totalRate * 0.4).toFixed(1)}/s`} color="#4ade80" />
          <FloatingNumber position={[1.3, 2.7, 0.5]} value={`${(totalRate * 0.35).toFixed(1)}/s`} color="#00d4e6" />
          <FloatingNumber position={[0.2, 2.9, -0.5]} value={`${(totalRate * 0.25).toFixed(1)}/s`} color="#e6bf33" />
        </group>

        {/* Controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          minDistance={4}
          maxDistance={12}
          minPolarAngle={Math.PI * 0.25}
          maxPolarAngle={Math.PI * 0.65}
        />
      </Canvas>

      {/* ═══ SKIN SELECTOR OVERLAY ═══ */}
      {showSkinSelector && (
        <div className="absolute inset-0 z-20 flex flex-col justify-end"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9) 40%, transparent)" }}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-white text-sm">Skins de Aris</span>
              <button onClick={() => setShowSkinSelector(false)}
                className="text-white/60 hover:text-white text-xs px-2 py-1 rounded bg-white/10">
                Cerrar ✕
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {SKINS.map(skin => {
                const isActive = skin.id === currentSkinId;
                const isUnlocked = skin.id === "default" || skin.id === "bronze_warrior" || skin.id === "dark_knight";
                return (
                  <button key={skin.id}
                    onClick={() => { if (isUnlocked && onSkinChange) { onSkinChange(skin.id); } }}
                    className={`shrink-0 w-16 rounded-xl p-1.5 border transition-all ${
                      isActive ? "border-cyan-400 bg-cyan-400/10 scale-105" :
                      isUnlocked ? "border-white/20 bg-white/5 hover:border-white/40" :
                      "border-white/10 bg-white/5 opacity-40 cursor-not-allowed"
                    }`}>
                    {/* Mini skin preview */}
                    <div className="w-8 h-10 mx-auto mb-1 rounded-lg relative overflow-hidden"
                      style={{ background: `linear-gradient(135deg, ${skin.body}, ${skin.headEmissive})` }}>
                      {/* Head dot */}
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
                        style={{ background: skin.visor, boxShadow: `0 0 6px ${skin.glow}` }} />
                      {/* Body */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-5 rounded-t-lg"
                        style={{ background: skin.bodyEmissive }} />
                      {!isUnlocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-[10px]">🔒</div>
                      )}
                    </div>
                    <div className="text-[7px] text-center text-white/80 leading-tight truncate">{skin.name}</div>
                    {isActive && <div className="text-[6px] text-cyan-400 text-center">equipado</div>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

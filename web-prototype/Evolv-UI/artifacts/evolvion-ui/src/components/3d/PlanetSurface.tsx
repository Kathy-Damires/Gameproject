// @ts-nocheck
import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Float, Html, Sky, Environment } from "@react-three/drei";
import * as THREE from "three";
import { SKINS, type SkinDef } from "./PlanetScene";

/* ═══════════════════════════════════════════
   GROUND — Terrain surface
   ═══════════════════════════════════════════ */
function Ground({ color }: { color: string }) {
  const mainColor = new THREE.Color(color).multiplyScalar(0.3);
  const darkColor = mainColor.clone().multiplyScalar(0.5);

  return (
    <group>
      {/* Main ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[30, 30, 32, 32]} />
        <meshStandardMaterial color={mainColor} roughness={0.9} metalness={0.1} />
      </mesh>
      {/* Rocks scattered */}
      {[...Array(8)].map((_, i) => {
        const x = (Math.random() - 0.5) * 12;
        const z = (Math.random() - 0.5) * 12;
        const s = 0.1 + Math.random() * 0.3;
        return (
          <mesh key={i} position={[x, s * 0.4, z]}>
            <dodecahedronGeometry args={[s, 0]} />
            <meshStandardMaterial color={darkColor} roughness={0.8} />
          </mesh>
        );
      })}
      {/* Glowing crystal formations */}
      {[[-3, 0, -2], [4, 0, 1], [-1, 0, 4], [5, 0, -4]].map((pos, i) => (
        <group key={`crystal-${i}`} position={pos as [number, number, number]}>
          <mesh position={[0, 0.4, 0]} rotation={[0, i * 1.2, 0.1]}>
            <coneGeometry args={[0.08, 0.8, 5]} />
            <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={0.6}
              transparent opacity={0.7} />
          </mesh>
          <mesh position={[0.15, 0.3, 0.1]} rotation={[0.2, i, -0.15]}>
            <coneGeometry args={[0.05, 0.5, 5]} />
            <meshStandardMaterial color="#9b00ff" emissive="#9b00ff" emissiveIntensity={0.5}
              transparent opacity={0.6} />
          </mesh>
          <pointLight position={[0, 0.6, 0]} color="#00e5ff" intensity={0.3} distance={3} />
        </group>
      ))}
      {/* Energy portal — like in the mockup */}
      <group position={[0, 0, -5]}>
        <mesh position={[0, 2, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[1.2, 0.08, 16, 32]} />
          <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={1.5}
            transparent opacity={0.8} />
        </mesh>
        <mesh position={[0, 2, 0]}>
          <torusGeometry args={[1.0, 0.04, 16, 32]} />
          <meshStandardMaterial color="#9b00ff" emissive="#9b00ff" emissiveIntensity={1}
            transparent opacity={0.6} />
        </mesh>
        {/* Portal inner glow */}
        <mesh position={[0, 2, 0]}>
          <circleGeometry args={[1.1, 32]} />
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
        {/* Portal pillars */}
        <mesh position={[-1.3, 1, 0]}>
          <boxGeometry args={[0.15, 2, 0.15]} />
          <meshStandardMaterial color="#1a1a3e" roughness={0.4} metalness={0.6}
            emissive="#9b00ff" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[1.3, 1, 0]}>
          <boxGeometry args={[0.15, 2, 0.15]} />
          <meshStandardMaterial color="#1a1a3e" roughness={0.4} metalness={0.6}
            emissive="#9b00ff" emissiveIntensity={0.2} />
        </mesh>
        <pointLight position={[0, 2, 0.5]} color="#00e5ff" intensity={2} distance={6} />
      </group>

      {/* Terrain features — elevated rocky areas */}
      {[[-4, 0, -3], [5, 0, -2], [-2, 0, 3], [3, 0, 4]].map((pos, i) => (
        <mesh key={`hill-${i}`} position={pos as [number, number, number]}>
          <coneGeometry args={[1 + Math.random() * 0.5, 0.8 + Math.random() * 0.4, 6]} />
          <meshStandardMaterial color={mainColor.clone().multiplyScalar(0.6)} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════
   DETAILED STRUCTURE — Full 3D building
   ═══════════════════════════════════════════ */
interface DetailedStructureProps {
  name: string;
  level: number;
  rate: number;
  resourceName: string;
  color: string;
  position: [number, number, number];
  type: "quarry" | "lumber" | "farm" | "forge" | "generator" | "temple";
  onClick?: () => void;
}

function DetailedStructure({ name, level, rate, resourceName, color, position, type, onClick }: DetailedStructureProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const structColor = new THREE.Color(color);
  const height = 0.6 + level * 0.15;

  useFrame((state) => {
    if (groupRef.current && hovered) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={position}
      onClick={onClick}
      onPointerOver={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = "default"; }}>

      {/* Foundation */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.6, 0.7, 0.1, 8]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.7} roughness={0.3} />
      </mesh>

      {type === "quarry" && (
        <group>
          {/* Main rock structure */}
          <mesh position={[0, height * 0.4, 0]}>
            <boxGeometry args={[0.7, height * 0.6, 0.5]} />
            <meshStandardMaterial color={structColor} roughness={0.6} metalness={0.3}
              emissive={structColor} emissiveIntensity={hovered ? 0.4 : 0.15} />
          </mesh>
          {/* Chimney */}
          <mesh position={[0.2, height * 0.8, 0]}>
            <cylinderGeometry args={[0.06, 0.08, height * 0.4, 6]} />
            <meshStandardMaterial color="#555" roughness={0.4} metalness={0.5} />
          </mesh>
          {/* Conveyor belt */}
          <mesh position={[-0.4, 0.2, 0]} rotation={[0, 0, -0.3]}>
            <boxGeometry args={[0.5, 0.06, 0.15]} />
            <meshStandardMaterial color="#333" roughness={0.3} metalness={0.6} />
          </mesh>
          {/* Mining carts */}
          <mesh position={[-0.5, 0.15, 0.15]}>
            <boxGeometry args={[0.12, 0.1, 0.1]} />
            <meshStandardMaterial color="#8B4513" roughness={0.7} />
          </mesh>
        </group>
      )}

      {type === "forge" && (
        <group>
          {/* Furnace body */}
          <mesh position={[0, height * 0.35, 0]}>
            <cylinderGeometry args={[0.35, 0.4, height * 0.6, 8]} />
            <meshStandardMaterial color={structColor} roughness={0.5} metalness={0.4}
              emissive={structColor} emissiveIntensity={hovered ? 0.5 : 0.2} />
          </mesh>
          {/* Furnace top / dome */}
          <mesh position={[0, height * 0.7, 0]}>
            <sphereGeometry args={[0.3, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={structColor.clone().multiplyScalar(0.7)} roughness={0.4} metalness={0.5} />
          </mesh>
          {/* Fire glow inside */}
          <mesh position={[0, height * 0.3, 0.3]}>
            <boxGeometry args={[0.2, 0.2, 0.05]} />
            <meshStandardMaterial color="#ff4500" emissive="#ff4500" emissiveIntensity={1.5} />
          </mesh>
          <pointLight position={[0, height * 0.3, 0.4]} color="#ff6600" intensity={1} distance={3} />
          {/* Anvil */}
          <mesh position={[0.5, 0.15, 0]}>
            <boxGeometry args={[0.2, 0.15, 0.12]} />
            <meshStandardMaterial color="#444" roughness={0.3} metalness={0.8} />
          </mesh>
        </group>
      )}

      {type === "lumber" && (
        <group>
          {/* Cabin body */}
          <mesh position={[0, height * 0.3, 0]}>
            <boxGeometry args={[0.6, height * 0.5, 0.5]} />
            <meshStandardMaterial color={structColor} roughness={0.7} metalness={0.1}
              emissive={structColor} emissiveIntensity={hovered ? 0.3 : 0.1} />
          </mesh>
          {/* Roof */}
          <mesh position={[0, height * 0.65, 0]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[0.5, height * 0.3, 4]} />
            <meshStandardMaterial color={structColor.clone().multiplyScalar(0.6)} roughness={0.6} />
          </mesh>
          {/* Log pile */}
          {[0, 0.1, 0.2].map((y, i) => (
            <mesh key={i} position={[0.5, 0.08 + y, 0.1 * (i - 1)]}>
              <cylinderGeometry args={[0.04, 0.04, 0.3, 6]} rotation={[0, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#6B4520" roughness={0.8} />
            </mesh>
          ))}
          {/* Axe */}
          <mesh position={[-0.45, 0.25, 0.2]} rotation={[0, 0, 0.3]}>
            <boxGeometry args={[0.03, 0.35, 0.03]} />
            <meshStandardMaterial color="#5C4033" roughness={0.7} />
          </mesh>
        </group>
      )}

      {type === "farm" && (
        <group>
          {/* Barn */}
          <mesh position={[0, height * 0.25, 0]}>
            <boxGeometry args={[0.55, height * 0.4, 0.45]} />
            <meshStandardMaterial color={structColor} roughness={0.7} metalness={0.1}
              emissive={structColor} emissiveIntensity={hovered ? 0.3 : 0.1} />
          </mesh>
          {/* Barn roof */}
          <mesh position={[0, height * 0.55, 0]}>
            <coneGeometry args={[0.45, height * 0.25, 4]} />
            <meshStandardMaterial color="#8B0000" roughness={0.6} />
          </mesh>
          {/* Crop rows */}
          {[-0.3, -0.15, 0, 0.15, 0.3].map((x, i) => (
            <mesh key={i} position={[x, 0.05, 0.55]}>
              <boxGeometry args={[0.08, 0.1, 0.3]} />
              <meshStandardMaterial color="#228B22" roughness={0.8}
                emissive="#228B22" emissiveIntensity={0.1} />
            </mesh>
          ))}
          {/* Fence */}
          {[-0.4, 0.4].map((x, i) => (
            <mesh key={`fence-${i}`} position={[x, 0.12, 0.55]}>
              <boxGeometry args={[0.02, 0.2, 0.4]} />
              <meshStandardMaterial color="#8B7355" roughness={0.8} />
            </mesh>
          ))}
        </group>
      )}

      {type === "generator" && (
        <group>
          {/* Core cylinder */}
          <mesh position={[0, height * 0.4, 0]}>
            <cylinderGeometry args={[0.25, 0.35, height * 0.7, 12]} />
            <meshStandardMaterial color={structColor} roughness={0.2} metalness={0.8}
              emissive={structColor} emissiveIntensity={hovered ? 0.6 : 0.3} />
          </mesh>
          {/* Energy orb on top */}
          <Float speed={4} floatIntensity={0.2}>
            <mesh position={[0, height * 0.9, 0]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2}
                transparent opacity={0.8} />
            </mesh>
          </Float>
          <pointLight position={[0, height, 0]} color="#00ffff" intensity={2} distance={4} />
          {/* Rings */}
          <mesh position={[0, height * 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.4, 0.015, 8, 32]} />
            <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={0.5} />
          </mesh>
        </group>
      )}

      {type === "temple" && (
        <group>
          {/* Base steps */}
          {[0, 0.1, 0.2].map((y, i) => (
            <mesh key={i} position={[0, y + 0.05, 0]}>
              <boxGeometry args={[0.7 - i * 0.12, 0.1, 0.6 - i * 0.1]} />
              <meshStandardMaterial color={structColor.clone().multiplyScalar(0.8 + i * 0.1)}
                roughness={0.5} metalness={0.3} />
            </mesh>
          ))}
          {/* Columns */}
          {[[-0.2, 0.25], [0.2, 0.25], [-0.2, -0.15], [0.2, -0.15]].map(([x, z], i) => (
            <mesh key={i} position={[x, height * 0.5, z]}>
              <cylinderGeometry args={[0.04, 0.05, height * 0.6, 8]} />
              <meshStandardMaterial color={structColor} roughness={0.4} metalness={0.4}
                emissive={structColor} emissiveIntensity={0.2} />
            </mesh>
          ))}
          {/* Roof / top */}
          <mesh position={[0, height * 0.85, 0.05]}>
            <coneGeometry args={[0.35, height * 0.2, 4]} />
            <meshStandardMaterial color={structColor} roughness={0.4} metalness={0.4}
              emissive={structColor} emissiveIntensity={hovered ? 0.4 : 0.15} />
          </mesh>
          {/* Sacred glow */}
          <pointLight position={[0, height * 0.5, 0.05]} color={color} intensity={0.5} distance={3} />
        </group>
      )}

      {/* Glow ring on ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.55, 0.65, 32]} />
        <meshBasicMaterial color={color} transparent opacity={hovered ? 0.4 : 0.15} />
      </mesh>

      {/* Level indicator */}
      <pointLight position={[0, height + 0.2, 0]} color={color}
        intensity={hovered ? 1.5 : 0.5} distance={2} />

      {/* Label */}
      <Html position={[0, height + 0.4, 0]} center distanceFactor={5} style={{ pointerEvents: "none" }}>
        <div className="flex flex-col items-center gap-0.5 select-none">
          <div className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-white whitespace-nowrap"
            style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)",
              border: `1px solid ${hovered ? color : color + '40'}`,
              boxShadow: hovered ? `0 0 12px ${color}60` : 'none' }}>
            {name} <span className="text-white/50 ml-1">Nv.{level}</span>
          </div>
          <div className="px-2 py-0.5 rounded text-[9px] font-bold whitespace-nowrap"
            style={{ background: "rgba(0,200,100,0.15)", color: "#4ade80" }}>
            +{rate}/s {resourceName}
          </div>
        </div>
      </Html>
    </group>
  );
}

/* ═══════════════════════════════════════════
   DETAILED ARIS — Full character model
   ═══════════════════════════════════════════ */
function DetailedAris({ position, skin, onClick }: {
  position: [number, number, number]; skin: SkinDef; onClick?: () => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const breathRef = useRef(0);

  useFrame((state, delta) => {
    if (!ref.current) return;
    breathRef.current += delta;
    // Breathing animation
    const breathScale = 1 + Math.sin(breathRef.current * 2) * 0.015;
    ref.current.scale.set(0.35 * breathScale, 0.35 * breathScale, 0.35 * breathScale);
    // Idle sway
    ref.current.rotation.y = Math.sin(breathRef.current * 0.5) * 0.08;
    // Hover spin
    if (hovered) {
      ref.current.rotation.y += delta * 1.5;
    }
  });

  return (
    <group ref={ref} position={position} scale={0.35}
      onClick={onClick}
      onPointerOver={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = "default"; }}>

      {/* Feet */}
      <mesh position={[-0.12, 0.08, 0]}>
        <boxGeometry args={[0.1, 0.08, 0.18]} />
        <meshStandardMaterial color={skin.body} roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[0.12, 0.08, 0]}>
        <boxGeometry args={[0.1, 0.08, 0.18]} />
        <meshStandardMaterial color={skin.body} roughness={0.5} metalness={0.4} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.1, 0.45, 0]}>
        <capsuleGeometry args={[0.08, 0.5, 4, 8]} />
        <meshStandardMaterial color={skin.body} roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[0.1, 0.45, 0]}>
        <capsuleGeometry args={[0.08, 0.5, 4, 8]} />
        <meshStandardMaterial color={skin.body} roughness={0.5} metalness={0.4} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 1.1, 0]}>
        <capsuleGeometry args={[0.28, 0.6, 8, 16]} />
        <meshStandardMaterial color={skin.body} roughness={0.4} metalness={0.5}
          emissive={skin.bodyEmissive} emissiveIntensity={hovered ? 0.5 : 0.25} />
      </mesh>

      {/* Chest plate detail */}
      <mesh position={[0, 1.15, 0.22]}>
        <boxGeometry args={[0.3, 0.25, 0.06]} />
        <meshStandardMaterial color={skin.headEmissive} roughness={0.3} metalness={0.6}
          emissive={skin.headEmissive} emissiveIntensity={0.3} />
      </mesh>

      {/* Belt */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.27, 0.27, 0.06, 16]} />
        <meshStandardMaterial color="#222" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Belt buckle */}
      <mesh position={[0, 0.8, 0.26]}>
        <boxGeometry args={[0.08, 0.08, 0.02]} />
        <meshStandardMaterial color={skin.visor} emissive={skin.visor} emissiveIntensity={0.5} />
      </mesh>

      {/* Shoulder pads */}
      {skin.shoulderPads && (<>
        <mesh position={[-0.38, 1.4, 0]}>
          <sphereGeometry args={[0.14, 8, 8]} />
          <meshStandardMaterial color={skin.headEmissive} roughness={0.3} metalness={0.6}
            emissive={skin.headEmissive} emissiveIntensity={0.4} />
        </mesh>
        <mesh position={[0.38, 1.4, 0]}>
          <sphereGeometry args={[0.14, 8, 8]} />
          <meshStandardMaterial color={skin.headEmissive} roughness={0.3} metalness={0.6}
            emissive={skin.headEmissive} emissiveIntensity={0.4} />
        </mesh>
      </>)}

      {/* Arms */}
      <mesh position={[-0.35, 1.0, 0]} rotation={[0, 0, 0.2]}>
        <capsuleGeometry args={[0.07, 0.55, 4, 8]} />
        <meshStandardMaterial color={skin.body} roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[0.35, 1.0, 0]} rotation={[0, 0, -0.2]}>
        <capsuleGeometry args={[0.07, 0.55, 4, 8]} />
        <meshStandardMaterial color={skin.body} roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Hands */}
      <mesh position={[-0.42, 0.6, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color={skin.headEmissive} roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[0.42, 0.6, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color={skin.headEmissive} roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.55, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.1, 8]} />
        <meshStandardMaterial color={skin.body} roughness={0.5} metalness={0.4} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color={skin.head} roughness={0.3} metalness={0.4}
          emissive={skin.headEmissive} emissiveIntensity={hovered ? 0.6 : 0.35} />
      </mesh>

      {/* Visor */}
      <mesh position={[0, 1.8, 0.18]}>
        <sphereGeometry args={[0.12, 16, 16, 0, Math.PI]} />
        <meshStandardMaterial color={skin.visor} emissive={skin.visor} emissiveIntensity={1}
          transparent opacity={0.8} />
      </mesh>

      {/* Antenna / detail on helmet */}
      <mesh position={[0, 2.05, 0]}>
        <cylinderGeometry args={[0.015, 0.01, 0.12, 4]} />
        <meshStandardMaterial color={skin.visor} emissive={skin.visor} emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, 2.12, 0]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color={skin.visor} emissive={skin.visor} emissiveIntensity={1.5} />
      </mesh>

      {/* Cape */}
      {skin.cape && (
        <mesh position={[0, 1.05, -0.25]} rotation={[0.1, 0, 0]}>
          <boxGeometry args={[0.45, 0.85, 0.03]} />
          <meshStandardMaterial color={skin.cape} roughness={0.6} metalness={0.2}
            emissive={skin.cape} emissiveIntensity={0.15} transparent opacity={0.85} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Wings */}
      {skin.wings && (<>
        <mesh position={[-0.5, 1.3, -0.2]} rotation={[0, -0.5, 0.3]}>
          <boxGeometry args={[0.6, 0.7, 0.02]} />
          <meshStandardMaterial color={skin.aura || skin.glow} roughness={0.2} metalness={0.3}
            emissive={skin.aura || skin.glow} emissiveIntensity={1} transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0.5, 1.3, -0.2]} rotation={[0, 0.5, -0.3]}>
          <boxGeometry args={[0.6, 0.7, 0.02]} />
          <meshStandardMaterial color={skin.aura || skin.glow} roughness={0.2} metalness={0.3}
            emissive={skin.aura || skin.glow} emissiveIntensity={1} transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      </>)}

      {/* Aura */}
      {skin.aura && (
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[0.7, 16, 16]} />
          <meshBasicMaterial color={skin.aura} transparent opacity={hovered ? 0.12 : 0.05} side={THREE.BackSide} />
        </mesh>
      )}

      {/* Ground shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.3, 16]} />
        <meshBasicMaterial color="#000" transparent opacity={0.3} />
      </mesh>

      {/* Lights */}
      <pointLight position={[0, 0.5, -0.3]} color={skin.glow} intensity={hovered ? 2 : 0.8} distance={3} />
      <pointLight position={[0, 1.8, 0.3]} color={skin.visor} intensity={0.6} distance={2} />

      {/* Hover label */}
      {hovered && (
        <Html position={[0, 2.5, 0]} center distanceFactor={4} style={{ pointerEvents: "none" }}>
          <div className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-white whitespace-nowrap select-none"
            style={{ background: "rgba(0,0,0,0.85)", border: `1px solid ${skin.glow}60`,
              boxShadow: `0 0 15px ${skin.glow}40` }}>
            Aris — {skin.name}
            <div className="text-[8px] text-center text-white/50 mt-0.5">Click para cambiar skin</div>
          </div>
        </Html>
      )}
    </group>
  );
}

/* ═══════════════════════════════════════════
   MAIN SURFACE SCENE
   ═══════════════════════════════════════════ */
export interface SurfaceStructure {
  name: string;
  level: number;
  rate: number;
  resourceName: string;
  color: string;
  type: "quarry" | "lumber" | "farm" | "forge" | "generator" | "temple";
}

interface PlanetSurfaceProps {
  planetColor: string;
  structures: SurfaceStructure[];
  currentSkinId?: string;
  onSkinChange?: (skinId: string) => void;
  onStructureClick?: (name: string) => void;
  className?: string;
}

export default function PlanetSurface({ planetColor, structures, currentSkinId = "default", onSkinChange, onStructureClick, className }: PlanetSurfaceProps) {
  const [showSkinSelector, setShowSkinSelector] = useState(false);
  const currentSkin = SKINS.find(s => s.id === currentSkinId) || SKINS[0];

  // 9 structure positions spread across terrain like mockup
  const structPositions: [number, number, number][] = useMemo(() => {
    const presets: [number, number, number][] = [
      [-3, 0, -1],      // far left
      [1.5, 0, -1],     // center-right
      [3.5, 0, 0.5],    // far right
      [-1.5, 0, -3],    // left-back
      [0.5, 0, -3.5],   // center-back
      [3, 0, -2.5],     // right-back
      [-3.5, 0, -3.5],  // far left-back
      [2, 0, -5],       // deep right
      [-0.5, 0, -5.5],  // deep center
    ];
    return structures.map((_, i) => presets[i % presets.length]);
  }, [structures.length]);

  return (
    <div className={className} style={{ width: "100%", height: "100%", minHeight: 350, position: "relative" }}>
      <Canvas
        camera={{ position: [0, 4.5, 4], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        shadows
        style={{ background: "transparent" }}
      >
        <color attach="background" args={["#0a0515"]} />

        {/* Sky / atmosphere */}
        <fog attach="fog" args={["#0a0515", 10, 25]} />

        {/* Lighting */}
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 8, 5]} intensity={0.6} color="#ffffff" castShadow />
        <directionalLight position={[-3, 4, -4]} intensity={0.3} color="#9b00ff" />
        <pointLight position={[0, 5, 0]} intensity={0.3} color={planetColor} />

        {/* Stars */}
        <Stars radius={40} depth={30} count={2000} factor={3} saturation={0.6} fade speed={0.3} />

        {/* Ground */}
        <Ground color={planetColor} />

        {/* Aris — foreground, slightly left like mockup */}
        <DetailedAris position={[-0.8, 0, 2]} skin={currentSkin}
          onClick={() => setShowSkinSelector(true)} />

        {/* Structures around */}
        {structures.map((s, i) => (
          <DetailedStructure key={s.name} {...s}
            position={structPositions[i] || [0, 0, 0]}
            onClick={() => onStructureClick?.(s.name)} />
        ))}

        {/* Orbit controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          autoRotate={false}
          minDistance={3}
          maxDistance={12}
          minPolarAngle={Math.PI * 0.15}
          maxPolarAngle={Math.PI * 0.45}
          target={[0, 0.5, -1]}
        />
      </Canvas>

      {/* View label */}
      <div className="absolute top-3 left-3 z-10 px-2 py-1 rounded-lg text-[9px] text-white/50 bg-black/50 select-none">
        Vista de Superficie — arrastrá para rotar, scroll para zoom
      </div>

      {/* Skin selector overlay */}
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
                const isUnlocked = ["default", "bronze_warrior", "dark_knight"].includes(skin.id);
                return (
                  <button key={skin.id}
                    onClick={() => { if (isUnlocked && onSkinChange) onSkinChange(skin.id); }}
                    className={`shrink-0 w-16 rounded-xl p-1.5 border transition-all ${
                      isActive ? "border-cyan-400 bg-cyan-400/10 scale-105" :
                      isUnlocked ? "border-white/20 bg-white/5 hover:border-white/40" :
                      "border-white/10 bg-white/5 opacity-40 cursor-not-allowed"
                    }`}>
                    <div className="w-8 h-10 mx-auto mb-1 rounded-lg relative overflow-hidden"
                      style={{ background: `linear-gradient(135deg, ${skin.body}, ${skin.headEmissive})` }}>
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
                        style={{ background: skin.visor, boxShadow: `0 0 6px ${skin.glow}` }} />
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

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../store/useGameStore';
import { gameRefs } from '../../store/gameRefs';
import { Box3, Vector3 } from 'three';

const COLLISION_THRESHOLD = 0.5;

export const Obstacle = ({ position, type = 'barrier' }) => {
    const mesh = useRef();
    const { hitObstacle, isPlaying } = useGameStore();
    const hit = useRef(false);

    useFrame(() => {
        if (!isPlaying || !mesh.current || hit.current) return;

        // Simple distance check first for optimization
        const worldPos = new Vector3();
        mesh.current.getWorldPosition(worldPos);

        if (worldPos.z > gameRefs.playerPosition.z + 5) return;
        if (worldPos.z < gameRefs.playerPosition.z - 5) return;

        // Check if close enough in Z
        if (Math.abs(worldPos.z - gameRefs.playerPosition.z) < 1) {
            // Check Lane (X)
            if (Math.abs(worldPos.x - gameRefs.playerPosition.x) < 0.8) {
                // Check Height (Y) - for jumping
                // Obstacle is 1 unit high. Player feet approx at Y+0.2.
                // We need Y+0.2 < 1.0 for collision. So if Y > 0.8 we are safe.
                // Using 1.1 provides good clearance margin.
                if (gameRefs.playerPosition.y < 1.1) {
                    console.log("Collision!");
                    hitObstacle();
                    hit.current = true;
                }
            }
        }
    });

    return (
        <mesh ref={mesh} position={position} castShadow>
            <boxGeometry args={[1, 1, 0.5]} />
            <meshStandardMaterial color="red" />
        </mesh>
    );
};

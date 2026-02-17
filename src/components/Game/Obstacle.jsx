import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../store/useGameStore';
import { gameRefs } from '../../store/gameRefs';
import { Box3, Vector3 } from 'three';

const COLLISION_THRESHOLD = 0.5;

export const Obstacle = ({ position, type = 'barrier' }) => {
    const mesh = useRef();
    const { endGame, isPlaying } = useGameStore();
    const box = useRef(new Box3());

    useFrame(() => {
        if (!isPlaying || !mesh.current) return;

        // Simple distance check first for optimization
        const playerZ = gameRefs.playerPosition.z;
        const obstacleZ = mesh.current.position.z + position[2]; // absolute Z if parented to track?
        // Actually, if Obstacle is child of Track segment, its world position needs calculation.
        // If we use world position check:

        // Let's rely on simple lane check + Z distance to avoid world matrix updates every frame if possible.
        // But parent moves? No, Track segments are static meshes placed at Z.
        // So Obstacle position is relative to Segment?
        // If Track renders: <mesh position={[...]}><Obstacle /></mesh> -> Obstacle is relative.

        // Best to use world position.
        const worldPos = new Vector3();
        mesh.current.getWorldPosition(worldPos);

        if (worldPos.z > gameRefs.playerPosition.z + 5) return; // Passed optimization
        if (worldPos.z < gameRefs.playerPosition.z - 5) return; // Too far ahead? No, player moves -Z.
        // Player -Z increases. 0 -> -10 -> -100.
        // Objects are at -10, -20.
        // If Player is -15. Object at -10 is behind (z > playerZ). Object at -20 is ahead (z < playerZ).

        // Check if close enough in Z
        if (Math.abs(worldPos.z - gameRefs.playerPosition.z) < 1) {
            // Check Lane (X)
            if (Math.abs(worldPos.x - gameRefs.playerPosition.x) < 0.8) {
                // Check Height (Y) - for jumping
                if (gameRefs.playerPosition.y < 1.5) { // If not jumping high enough
                    console.log("Collision!");
                    endGame();
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

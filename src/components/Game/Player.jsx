import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, MathUtils } from 'three';
import { useGameStore } from '../../store/useGameStore';
import { gameRefs } from '../../store/gameRefs';

const LANE_WIDTH = 2; // Distance between lanes
const JUMP_HEIGHT = 2;
const JUMP_DURATION = 0.5;

export const Player = () => {
    const mesh = useRef();
    const [lane, setLane] = useState(0); // -1, 0, 1
    const [isJumping, setIsJumping] = useState(false);
    const jumpStartTime = useRef(0);

    const { isPlaying, speed, updateDistance } = useGameStore();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isPlaying) return;

            if (e.key === 'ArrowLeft' || e.key === 'a') {
                setLane((prev) => Math.max(prev - 1, -1));
            } else if (e.key === 'ArrowRight' || e.key === 'd') {
                setLane((prev) => Math.min(prev + 1, 1));
            } else if ((e.key === 'ArrowUp' || e.key === ' ' || e.key === 'w') && !isJumping) {
                setIsJumping(true);
                jumpStartTime.current = Date.now();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying, isJumping]);

    useFrame((state, delta) => {
        if (!isPlaying || !mesh.current) return;

        // Forward Movement
        const forwardSpeed = speed * delta;
        mesh.current.position.z -= forwardSpeed;
        updateDistance(forwardSpeed);

        // Sync to global ref for collision detection
        gameRefs.playerPosition.copy(mesh.current.position);

        // Lateral Movement (Lerp to lane)
        const targetX = lane * LANE_WIDTH;
        mesh.current.position.x = MathUtils.lerp(mesh.current.position.x, targetX, 10 * delta);

        // Jump Logic
        if (isJumping) {
            const timeElapsed = (Date.now() - jumpStartTime.current) / 1000;
            if (timeElapsed < JUMP_DURATION) {
                // Simple sine wave jump
                const progress = timeElapsed / JUMP_DURATION;
                mesh.current.position.y = 0.5 + Math.sin(progress * Math.PI) * JUMP_HEIGHT;
            } else {
                mesh.current.position.y = 0.5;
                setIsJumping(false);
            }
        } else {
            mesh.current.position.y = 0.5;
        }

        // Camera follow
        state.camera.position.z = mesh.current.position.z + 6;
        state.camera.position.y = mesh.current.position.y + 3;
        state.camera.position.x = MathUtils.lerp(state.camera.position.x, mesh.current.position.x * 0.5, 5 * delta);
        state.camera.lookAt(mesh.current.position.x * 0.2, 0, mesh.current.position.z - 4);
    });

    return (
        <mesh ref={mesh} position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="orange" />
        </mesh>
    );
};

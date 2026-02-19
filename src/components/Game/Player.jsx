import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
import { useGameStore } from '../../store/useGameStore';
import { gameRefs } from '../../store/gameRefs';

const LANE_WIDTH = 2; // Distance between lanes
const JUMP_HEIGHT = 2;
const JUMP_DURATION = 0.5;

export const Human = ({ isJumping }) => {
    const group = useRef();
    const leftArm = useRef();
    const rightArm = useRef();
    const leftLeg = useRef();
    const rightLeg = useRef();

    // Materials
    // Materials - Vibrant Colors
    const skinMaterial = <meshStandardMaterial color="#FFCC80" />; // Warmer Skin tone
    const shirtMaterial = <meshStandardMaterial color="#FF1744" />; // Bright Red/Pink shirt
    const pantsMaterial = <meshStandardMaterial color="#00E5FF" />; // Cyan/Blue pants
    const shoesMaterial = <meshStandardMaterial color="#FFD600" />; // Yellow shoes

    useFrame((state) => {
        if (!group.current) return;

        const time = state.clock.getElapsedTime();
        const speed = 10; // Animation speed

        if (isJumping) {
            // Jumping pose
            leftArm.current.rotation.x = Math.PI;
            rightArm.current.rotation.x = Math.PI;
            leftLeg.current.rotation.x = 0.5;
            rightLeg.current.rotation.x = 0.5;
        } else {
            // Running animation
            const angle = Math.sin(time * speed) * 0.5;

            // Arms swing opposite to legs
            leftArm.current.rotation.x = -angle;
            rightArm.current.rotation.x = angle;

            leftLeg.current.rotation.x = angle;
            rightLeg.current.rotation.x = -angle;
        }
    });

    return (
        <group ref={group}>
            {/* Head */}
            <mesh position={[0, 1.75, 0]}>
                <boxGeometry args={[0.3, 0.3, 0.3]} />
                {skinMaterial}
            </mesh>

            {/* Torso */}
            <mesh position={[0, 1.3, 0]}>
                <boxGeometry args={[0.4, 0.6, 0.2]} />
                {shirtMaterial}
            </mesh>

            {/* Arms - Pivot at shoulder (y=1.55) */}
            <group position={[0.25, 1.55, 0]} ref={rightArm}>
                <mesh position={[0, -0.25, 0]}>
                    <boxGeometry args={[0.12, 0.6, 0.12]} />
                    {skinMaterial}
                </mesh>
            </group>

            <group position={[-0.25, 1.55, 0]} ref={leftArm}>
                <mesh position={[0, -0.25, 0]}>
                    <boxGeometry args={[0.12, 0.6, 0.12]} />
                    {skinMaterial}
                </mesh>
            </group>

            {/* Legs - Pivot at hips (y=1.0) */}
            <group position={[0.1, 1.0, 0]} ref={rightLeg}>
                <mesh position={[0, -0.4, 0]}>
                    <boxGeometry args={[0.15, 0.8, 0.15]} />
                    {pantsMaterial}
                </mesh>
                <mesh position={[0, -0.85, 0.05]}>
                    <boxGeometry args={[0.16, 0.15, 0.25]} />
                    {shoesMaterial}
                </mesh>
            </group>

            <group position={[-0.1, 1.0, 0]} ref={leftLeg}>
                <mesh position={[0, -0.4, 0]}>
                    <boxGeometry args={[0.15, 0.8, 0.15]} />
                    {pantsMaterial}
                </mesh>
                <mesh position={[0, -0.85, 0.05]}>
                    <boxGeometry args={[0.16, 0.15, 0.25]} />
                    {shoesMaterial}
                </mesh>
            </group>
        </group>
    );
};

export const Player = () => {
    const mesh = useRef();
    const [lane, setLane] = useState(0); // -1, 0, 1
    const [isJumping, setIsJumping] = useState(false);
    const jumpStartTime = useRef(0);
    const jumpStartY = useRef(0);

    const { isPlaying, speed, updateDistance, isWaitingForInput, resumeRun } = useGameStore();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isPlaying) return;

            // Handle Input Waiting
            if (isWaitingForInput) {
                if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'a', 'd', 'w', ' '].includes(e.key)) {
                    resumeRun();
                    // Fall through to process the movement immediately
                } else {
                    return;
                }
            }

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
    }, [isPlaying, isJumping, isWaitingForInput]);

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
                mesh.current.position.y = Math.sin(progress * Math.PI) * JUMP_HEIGHT;
            } else {
                mesh.current.position.y = 0;
                setIsJumping(false);
            }
        } else {
            mesh.current.position.y = 0;
        }

        // Camera follow
        state.camera.position.z = mesh.current.position.z + 6;
        state.camera.position.y = mesh.current.position.y + 3;
        state.camera.position.x = MathUtils.lerp(state.camera.position.x, mesh.current.position.x * 0.5, 5 * delta);
        state.camera.lookAt(mesh.current.position.x * 0.2, 1, mesh.current.position.z - 4);
    });

    return (
        <group ref={mesh} position={[0, 0, 0]}>
            <Human isJumping={isJumping} />
        </group>
    );
};

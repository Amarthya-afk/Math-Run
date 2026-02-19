import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useGameStore } from '../../store/useGameStore';
import { gameRefs } from '../../store/gameRefs';
import { Vector3 } from 'three';

export const AnswerGate = ({ position, option, isCorrect }) => {
    const mesh = useRef();
    const { submitAnswer } = useGameStore();
    const [hit, setHit] = useState(false);

    useFrame(() => {
        if (hit || !mesh.current) return;

        // Check collision
        const worldPos = new Vector3();
        mesh.current.getWorldPosition(worldPos);

        if (Math.abs(worldPos.z - gameRefs.playerPosition.z) < 1) {
            // Z match
            if (Math.abs(worldPos.x - gameRefs.playerPosition.x) < 1) {
                // X match (Lane)
                setHit(true);
                submitAnswer(isCorrect);

                // Hide/Disable visual
                mesh.current.visible = false;
            }
        }
    });

    return (
        <group ref={mesh} position={position}>
            {/* Visual Gate */}
            <mesh position={[0, 1, 0]}>
                <boxGeometry args={[1.5, 2, 0.2]} />
                <meshStandardMaterial color={hit ? "gray" : "#2196F3"} transparent opacity={0.8} />
            </mesh>

            {/* Border */}
            <mesh position={[0, 1, 0]}>
                <boxGeometry args={[1.6, 2.1, 0.1]} />
                <meshStandardMaterial color="#0D47A1" />
            </mesh>

            {/* Text */}
            <Text
                position={[0, 1, 0.2]}
                fontSize={0.8}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                {option}
            </Text>
        </group>
    );
};

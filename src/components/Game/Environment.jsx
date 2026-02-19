import { useMemo } from 'react';

const SEGMENT_LENGTH = 25;

const SimpleTree = ({ position }) => (
    <group position={position}>
        {/* Trunk */}
        <mesh position={[0, 1, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.4, 2, 8]} />
            <meshStandardMaterial color="#5D4037" />
        </mesh>
        {/* Leaves */}
        <mesh position={[0, 2.5, 0]} castShadow>
            <coneGeometry args={[1.5, 3, 8]} />
            <meshStandardMaterial color="#4CAF50" />
        </mesh>
    </group>
);

const SimpleBush = ({ position }) => (
    <mesh position={position} castShadow>
        <dodecahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial color="#228B22" />
    </mesh>
);

export const Environment = ({ seed }) => {
    const decorations = useMemo(() => {
        const items = [];
        const sideOffset = 6; // Distance from center

        // Pseudo-random based on seed
        const random = (s) => Math.abs(Math.sin(s * 12.9898) * 43758.5453) % 1;

        // Left Side
        const leftCount = Math.floor(random(seed) * 3) + 1;
        for (let i = 0; i < leftCount; i++) {
            const z = -(random(seed + i) * SEGMENT_LENGTH) + (SEGMENT_LENGTH / 2);
            const x = -sideOffset - (random(seed + i * 2) * 3);
            const Type = random(seed + i * 3) > 0.5 ? SimpleTree : SimpleBush;
            items.push(<Type key={`l-${i}`} position={[x, 0, z]} />);
        }

        // Right Side
        const rightCount = Math.floor(random(seed + 100) * 3) + 1;
        for (let i = 0; i < rightCount; i++) {
            const z = -(random(seed + 100 + i) * SEGMENT_LENGTH) + (SEGMENT_LENGTH / 2);
            const x = sideOffset + (random(seed + 100 + i * 2) * 3);
            const Type = random(seed + 100 + i * 3) > 0.5 ? SimpleTree : SimpleBush;
            items.push(<Type key={`r-${i}`} position={[x, 0, z]} />);
        }

        return items;
    }, [seed]);

    return (
        <group>
            {/* Grass Ground Planes on sides */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-15, -0.2, 0]} receiveShadow>
                <planeGeometry args={[20, SEGMENT_LENGTH]} />
                <meshStandardMaterial color="#7CB342" />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[15, -0.2, 0]} receiveShadow>
                <planeGeometry args={[20, SEGMENT_LENGTH]} />
                <meshStandardMaterial color="#7CB342" />
            </mesh>

            {decorations}
        </group>
    );
};

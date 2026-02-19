import React, { useMemo } from 'react';

const SEGMENT_LENGTH = 25;
const LANE_WIDTH = 2; // -2, 0, 2

export const RailTrack = () => {
    // Create geometry for a single segment of track (3 lanes)

    // Ties: Wooden planks across the track
    // Spaced every 1.5 units
    const ties = useMemo(() => {
        const t = [];
        const count = Math.floor(SEGMENT_LENGTH / 1.5);
        for (let i = 0; i < count; i++) {
            t.push(
                <mesh key={`tie-${i}`} position={[0, -0.05, -SEGMENT_LENGTH / 2 + i * 1.5]} receiveShadow>
                    <boxGeometry args={[7, 0.1, 0.4]} />
                    <meshStandardMaterial color="#5D4037" />
                </mesh>
            );
        }
        return t;
    }, []);

    return (
        <group>
            {/* Gravel Bed */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
                <planeGeometry args={[10, SEGMENT_LENGTH]} />
                <meshStandardMaterial color="#795548" />
            </mesh>

            {/* Ties */}
            {ties}

            {/* Rails - 2 per lane */}
            {[-1, 0, 1].map((lane) => (
                <group key={`lane-${lane}`} position={[lane * LANE_WIDTH, 0, 0]}>
                    <mesh position={[-0.6, 0.1, 0]}>
                        <boxGeometry args={[0.1, 0.2, SEGMENT_LENGTH]} />
                        <meshStandardMaterial color="#90A4AE" metalness={0.8} roughness={0.2} />
                    </mesh>
                    <mesh position={[0.6, 0.1, 0]}>
                        <boxGeometry args={[0.1, 0.2, SEGMENT_LENGTH]} />
                        <meshStandardMaterial color="#90A4AE" metalness={0.8} roughness={0.2} />
                    </mesh>
                </group>
            ))}
        </group>
    );
};

import { useMemo } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Obstacle } from './Obstacle';
import { Instance, Instances } from '@react-three/drei';

const SEGMENT_LENGTH = 20;
const SEGMENT_COUNT = 10; // Number of segments to keep visible
const LANE_WIDTH = 2; // Distance between lanes

// Component for a single rail track (2 rails + sleepers)
const RailTrack = ({ position }) => {
    // 2 Rails
    // Sleepers every 1 unit
    const sleepers = [];
    for (let i = -SEGMENT_LENGTH / 2; i < SEGMENT_LENGTH / 2; i += 1.5) {
        sleepers.push(i);
    }

    return (
        <group position={position}>
            {/* Left Rail */}
            <mesh position={[-0.6, 0.1, 0]} receiveShadow>
                <boxGeometry args={[0.1, 0.2, SEGMENT_LENGTH]} />
                <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Right Rail */}
            <mesh position={[0.6, 0.1, 0]} receiveShadow>
                <boxGeometry args={[0.1, 0.2, SEGMENT_LENGTH]} />
                <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Sleepers */}
            {sleepers.map((z, index) => (
                <mesh key={index} position={[0, 0.05, z]} receiveShadow>
                    <boxGeometry args={[1.6, 0.1, 0.4]} />
                    <meshStandardMaterial color="#5c4033" /> {/* Dark wood */}
                </mesh>
            ))}
        </group>
    );
};

// Side decorations (Bushes, Rocks, etc.)
const Decoration = ({ position, type }) => {
    // Simple placeholder decorations
    if (type === 'bush') {
        return (
            <mesh position={position} castShadow>
                <dodecahedronGeometry args={[0.8, 0]} />
                <meshStandardMaterial color="#228b22" />
            </mesh>
        );
    } else if (type === 'rock') {
        return (
            <mesh position={position} castShadow rotation={[Math.random(), Math.random(), 0]}>
                <dodecahedronGeometry args={[0.6, 0]} />
                <meshStandardMaterial color="#666" />
            </mesh>
        );
    } else if (type === 'building') { // Simple tall box
        return (
            <mesh position={[position[0], 2, position[2]]} castShadow>
                <boxGeometry args={[2, 4, 2]} />
                <meshStandardMaterial color={Math.random() > 0.5 ? "#d2b48c" : "#a9a9a9"} />
            </mesh>
        );
    }
    return null;
};

export const Track = () => {
    const { distance } = useGameStore();

    // Calculate the index of the segment the player is currently on
    const currentSegmentIndex = Math.floor(distance / SEGMENT_LENGTH);

    // Generate a list of segment indices to render
    const segments = useMemo(() => {
        const visibleSegments = [];
        for (let i = -1; i < SEGMENT_COUNT; i++) {
            // We render from -1 (behind player) to SEGMENT_COUNT (ahead)
            visibleSegments.push(i);
        }
        return visibleSegments;
    }, []);

    return (
        <group>
            {segments.map((offset) => {
                // Determine the actual segment index in the world
                const segmentIndex = currentSegmentIndex + offset;
                // Calculate Z position: negative because we move into -Z
                const zPos = -(segmentIndex * SEGMENT_LENGTH);

                // Deterministic random for obstacle generation
                // Only spawn obstacles after the first few segments (e.g. > 2)
                const hasObstacle = segmentIndex > 2 && (segmentIndex * 1234567) % 3 === 0;
                // Lane based on index
                const laneIndex = (segmentIndex * 87654321) % 3; // 0, 1, 2
                const lane = laneIndex - 1; // -1, 0, 1

                // Decorations
                const leftDecoType = (segmentIndex * 111) % 5 === 0 ? 'building' : ((segmentIndex * 222) % 3 === 0 ? 'rock' : 'bush');
                const rightDecoType = (segmentIndex * 333) % 4 === 0 ? 'building' : ((segmentIndex * 444) % 2 === 0 ? 'bush' : 'rock');

                return (
                    <group key={segmentIndex} position={[0, 0, zPos - SEGMENT_LENGTH / 2]}>
                        {/* Ground / Gravel Bed */}
                        <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                            <planeGeometry args={[12, SEGMENT_LENGTH]} />
                            <meshStandardMaterial color="#555" roughness={1} />
                        </mesh>

                        {/* 3 Tracks */}
                        <RailTrack position={[-LANE_WIDTH, 0, 0]} />
                        <RailTrack position={[0, 0, 0]} />
                        <RailTrack position={[LANE_WIDTH, 0, 0]} />

                        {/* Side Decorations */}
                        <Decoration position={[-4, 0.5, 0]} type={leftDecoType} />
                        <Decoration position={[-4, 0.5, -5]} type={leftDecoType === 'building' ? 'building' : 'bush'} />
                        <Decoration position={[4, 0.5, 0]} type={rightDecoType} />
                        <Decoration position={[4, 0.5, 5]} type={rightDecoType === 'building' ? 'building' : 'rock'} />

                        {/* Obstacles */}
                        {hasObstacle && (
                            <Obstacle position={[lane * LANE_WIDTH, 0.5, 0]} />
                        )}
                    </group>
                );
            })}
        </group>
    );
};

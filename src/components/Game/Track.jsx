import { useMemo } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Obstacle } from './Obstacle';

const SEGMENT_LENGTH = 20;
const SEGMENT_COUNT = 10; // Number of segments to keep visible

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

                return (
                    <mesh
                        key={segmentIndex}
                        position={[0, 0, zPos - SEGMENT_LENGTH / 2]}
                        rotation={[-Math.PI / 2, 0, 0]}
                        receiveShadow
                    >
                        <planeGeometry args={[10, SEGMENT_LENGTH]} />
                        <meshStandardMaterial color={segmentIndex % 2 === 0 ? "#2a2a2a" : "#333"} />
                        {/* Lane markers */}
                        <mesh position={[0, 0, 0.01]} receiveShadow>
                            <planeGeometry args={[0.2, SEGMENT_LENGTH]} />
                            <meshStandardMaterial color="white" transparent opacity={0.3} />
                        </mesh>
                        <mesh position={[-2, 0, 0.01]} receiveShadow>
                            <planeGeometry args={[0.1, SEGMENT_LENGTH]} />
                            <meshStandardMaterial color="white" transparent opacity={0.1} />
                        </mesh>
                        <mesh position={[2, 0, 0.01]} receiveShadow>
                            <planeGeometry args={[0.1, SEGMENT_LENGTH]} />
                            <meshStandardMaterial color="white" transparent opacity={0.1} />
                        </mesh>

                        {hasObstacle && (
                            <group>
                                {/* Obstacle is child of rotation -PI/2, so we need to adjust.
                             Actually, Obstacle expects position in world frame usually?
                             No, simpler to just treat this group as local to the floor.
                             Floor is X-Y plane (rotated). 
                             So Z (up) in local is Y (up) in world?
                             Rotation X = -90deg.
                             Local X = World X.
                             Local Y = World -Z.
                             Local Z = World Y.
                          */}
                                <group rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                                    {/* Now we are back to World orientation relative to the segment center */}
                                    <Obstacle position={[lane * 2, 0.5, 0]} />
                                </group>
                            </group>
                        )}
                    </mesh>
                );
            })}
        </group>
    );
};

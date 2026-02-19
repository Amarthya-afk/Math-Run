import { useMemo } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Obstacle } from './Obstacle';
import { AnswerGate } from './AnswerGate';
import { generateQuestion } from '../../utils/mathGenerator';
import { getSegmentData } from '../../utils/trackLogic';

const SEGMENT_LENGTH = 25;
const SEGMENT_COUNT = 10;

export const Track = () => {
    const { distance, runId } = useGameStore();
    const currentSegmentIndex = Math.floor(distance / SEGMENT_LENGTH);

    const segments = useMemo(() => {
        const visibleSegments = [];
        for (let i = -1; i < SEGMENT_COUNT; i++) {
            visibleSegments.push(i);
        }
        return visibleSegments;
    }, []);

    return (
        <group>
            {segments.map((offset) => {
                const segmentIndex = currentSegmentIndex + offset;
                const zPos = -(segmentIndex * SEGMENT_LENGTH);

                // Start generating only after start line
                if (segmentIndex < 0) return null;

                const { isQuestion, hasObstacle, obstacleLane } = getSegmentData(segmentIndex, runId);

                // Generate Question Data if needed
                let questionData = null;
                if (isQuestion) {
                    // Unique seed for question content
                    questionData = generateQuestion(1, segmentIndex + (runId * 10000));
                }

                return (
                    <mesh
                        key={segmentIndex}
                        position={[0, 0, zPos - SEGMENT_LENGTH / 2]}
                        rotation={[-Math.PI / 2, 0, 0]}
                        receiveShadow
                    >
                        {/* Floor */}
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

                        {/* Obstacles */}
                        {hasObstacle && (
                            <group rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                                <Obstacle position={[obstacleLane * 2, 0.5, 0]} />
                            </group>
                        )}

                        {/* Answer Gates */}
                        {isQuestion && questionData && (
                            <group rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                                {[-1, 0, 1].map((lane, idx) => {
                                    if (idx >= questionData.options.length) return null;
                                    const option = questionData.options[idx];
                                    return (
                                        <AnswerGate
                                            key={`gate-${segmentIndex}-${lane}`}
                                            position={[lane * 2, 0, 0]}
                                            option={option}
                                            isCorrect={option === questionData.answer}
                                        />
                                    );
                                })}
                            </group>
                        )}
                    </mesh>
                );
            })}
        </group>
    );
};

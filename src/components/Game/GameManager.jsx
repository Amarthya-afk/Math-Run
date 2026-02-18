import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../store/useGameStore';
import { generateQuestion } from '../../utils/mathGenerator';
import { useRef } from 'react';

const SEGMENT_LENGTH = 20;

export const GameManager = () => {
    const { distance, setDisplayQuestion, isPlaying, waitForInput, runId } = useGameStore();
    const lastQuestionSegmentRaw = useRef(-1);
    const hasPausedForCurrent = useRef(false);

    useFrame(() => {
        if (!isPlaying) return;

        const currentSegmentIndex = Math.floor(distance / SEGMENT_LENGTH);
        // Find next multiple of 5 > currentSegmentIndex
        const nextQuestionSegment = Math.ceil((currentSegmentIndex + 0.1) / 5) * 5;
        const distSegments = nextQuestionSegment - currentSegmentIndex;

        // Visual Queue: Show question early (3 segments away)
        if (distSegments <= 3) {
            if (lastQuestionSegmentRaw.current !== nextQuestionSegment) {
                lastQuestionSegmentRaw.current = nextQuestionSegment;
                hasPausedForCurrent.current = false;

                const questionData = generateQuestion(1, nextQuestionSegment + (runId * 10000));
                setDisplayQuestion(questionData.text);
            }

            // Behavioral Queue: Pause when very close (1 segment away)
            // This ensures gates are visible.
            if (distSegments <= 1 && !hasPausedForCurrent.current) {
                waitForInput();
                hasPausedForCurrent.current = true;
            }
        }
    });

    return null;
};

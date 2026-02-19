import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../store/useGameStore';
import { generateQuestion } from '../../utils/mathGenerator';
import { getSegmentData } from '../../utils/trackLogic';
import { useRef } from 'react';

const SEGMENT_LENGTH = 25;

export const GameManager = () => {
    const { distance, setDisplayQuestion, isPlaying, waitForInput, runId } = useGameStore();
    const lastQuestionSegmentRaw = useRef(-1);
    const hasPausedForCurrent = useRef(false);

    useFrame(() => {
        if (!isPlaying) return;

        const currentSegmentIndex = Math.floor(distance / SEGMENT_LENGTH);

        // Lookahead: finding the next question segment
        let nextQuestionSegment = -1;
        // Search next 30 segments (covering 2 chunks usually)
        for (let i = currentSegmentIndex + 1; i < currentSegmentIndex + 30; i++) {
            if (getSegmentData(i, runId).isQuestion) {
                nextQuestionSegment = i;
                break;
            }
        }

        if (nextQuestionSegment === -1) return;

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
            if (distSegments <= 1 && !hasPausedForCurrent.current) {
                waitForInput();
                hasPausedForCurrent.current = true;
            }
        }
    });

    return null;
};

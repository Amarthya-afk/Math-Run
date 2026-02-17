import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../store/useGameStore';
import { generateQuestion } from '../../utils/mathGenerator';
import { useRef } from 'react';

const QUESTION_INTERVAL = 100; // Meters

export const GameManager = () => {
    const { distance, pauseGame, setQuestion, isPlaying } = useGameStore();
    const nextQuestionDistance = useRef(QUESTION_INTERVAL);

    useFrame(() => {
        if (!isPlaying) return;

        if (distance > nextQuestionDistance.current) {
            const question = generateQuestion(1); // Difficulty 1 for now
            setQuestion(question);
            pauseGame();
            nextQuestionDistance.current += QUESTION_INTERVAL;
        }
    });

    return null;
};

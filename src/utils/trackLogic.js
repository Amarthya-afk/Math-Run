// Simple seeded random function
const srandom = (seed) => {
    let value = seed;
    return () => {
        value = (value * 9301 + 49297) % 233280;
        return value / 233280;
    };
};

export const getSegmentData = (segmentIndex, runId) => {
    // Requirements:
    // 1. Questions every 100m
    // 2. Obstacles every 25m (if not a question)
    // Assuming SEGMENT_LENGTH = 25m

    // 1. Question Logic (Every 4th segment = 100m)
    // segmentIndex 0 is start line.
    const isQuestion = segmentIndex > 0 && segmentIndex % 4 === 0;

    // 2. Obstacle Logic (Every segment that isn't a question)
    // Start obstacles after segment 2 (50m) to give player a moment.
    let hasObstacle = !isQuestion && segmentIndex > 2;

    let obstacleLane = 0;
    let obstacleType = 'barrier';

    if (hasObstacle) {
        // Randomize Lane
        const segRandom = srandom(segmentIndex + (runId * 7777));
        const r = segRandom();

        if (r < 0.33) obstacleLane = -1;
        else if (r < 0.66) obstacleLane = 0;
        else obstacleLane = 1;
    }

    return {
        isQuestion,
        hasObstacle,
        obstacleLane,
        obstacleType
    };
};

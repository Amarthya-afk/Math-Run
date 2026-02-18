// Simple pseudo-random number generator with seed
const srandom = (seed) => {
    let value = seed;
    return () => {
        value = (value * 9301 + 49297) % 233280;
        return value / 233280;
    };
};

export const generateQuestion = (difficulty = 1, seed = Date.now()) => {
    // Ensure seed is an integer
    const safeSeed = Math.floor(seed);
    const random = srandom(safeSeed);

    const operations = ['+', '-', '*'];
    const operationIndex = Math.floor(random() * (difficulty > 5 ? 3 : 2));
    const operation = operations[operationIndex];

    let num1, num2, answer;

    switch (operation) {
        case '+':
            num1 = Math.floor(random() * 10 * difficulty) + 1;
            num2 = Math.floor(random() * 10 * difficulty) + 1;
            answer = num1 + num2;
            break;
        case '-':
            num1 = Math.floor(random() * 10 * difficulty) + 5;
            num2 = Math.floor(random() * num1);
            answer = num1 - num2;
            break;
        case '*':
            num1 = Math.floor(random() * 5 * difficulty) + 1;
            num2 = Math.floor(random() * 5) + 1;
            answer = num1 * num2;
            break;
        default:
            num1 = 1; num2 = 1; answer = 2;
    }

    // Generate options
    const options = new Set([answer]);
    let safety = 0;
    while (options.size < 3 && safety < 50) {
        safety++;
        const offset = Math.floor(random() * 5) + 1;
        // Random direction for offset
        const dir = random() > 0.5 ? 1 : -1;
        const wrong = answer + (offset * dir);
        if (wrong >= 0) options.add(wrong);
    }

    // Fill if failed to find distinct options
    while (options.size < 3) {
        options.add(answer + options.size + 1);
    }

    // Convert to array and shuffle deterministically
    // We need to consume random() calls in a fixed order or count to ensure stability logic essentially
    // But strictly sorting by random() is fine if random() is seeded.
    const optionsArray = Array.from(options).sort((a, b) => (random() - 0.5));

    return {
        text: `${num1} ${operation} ${num2} = ?`,
        answer: answer,
        options: optionsArray
    };
};

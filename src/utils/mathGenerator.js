export const generateQuestion = (difficulty = 1) => {
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * (difficulty > 5 ? 3 : 2))]; // Only + - at first

    let num1, num2, answer;

    switch (operation) {
        case '+':
            num1 = Math.floor(Math.random() * 10 * difficulty) + 1;
            num2 = Math.floor(Math.random() * 10 * difficulty) + 1;
            answer = num1 + num2;
            break;
        case '-':
            num1 = Math.floor(Math.random() * 10 * difficulty) + 5;
            num2 = Math.floor(Math.random() * num1); // Ensure positive result
            answer = num1 - num2;
            break;
        case '*':
            num1 = Math.floor(Math.random() * 5 * difficulty) + 1;
            num2 = Math.floor(Math.random() * 5) + 1;
            answer = num1 * num2;
            break;
        default:
            num1 = 1; num2 = 1; answer = 2;
    }

    // Generate options
    const options = new Set([answer]);
    while (options.size < 3) {
        const offset = Math.floor(Math.random() * 5) + 1;
        options.add(Math.random() > 0.5 ? answer + offset : answer - offset);
    }

    return {
        text: `${num1} ${operation} ${num2} = ?`,
        answer: answer,
        options: Array.from(options).sort(() => Math.random() - 0.5)
    };
};

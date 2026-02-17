import { useGameStore } from '../../store/useGameStore';

export const MathOverlay = () => {
    const { currentQuestion, isPaused, resumeGame, setQuestion } = useGameStore();

    if (!isPaused || !currentQuestion) return null;

    const handleAnswer = (option) => {
        if (option === currentQuestion.answer) {
            // Correct!
            setQuestion(null);
            resumeGame();
        } else {
            // Incorrect - For now just shake or alert
            alert("Try Again!");
            // Ideally, we'd have a penalty or visual feedback
        }
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center border-4 border-blue-500 transform scale-100 animate-bounce-in">
                <h2 className="text-4xl font-bold mb-8 text-blue-900 font-mono">
                    {currentQuestion.text}
                </h2>

                <div className="grid grid-cols-1 gap-4">
                    {currentQuestion.options.map((option, i) => (
                        <button
                            key={i}
                            onClick={() => handleAnswer(option)}
                            className="py-4 px-6 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-2xl rounded-xl transition-transform hover:scale-105 shadow-md active:scale-95 border-b-4 border-yellow-600"
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

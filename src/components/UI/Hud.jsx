import { useGameStore } from '../../store/useGameStore';

export const Hud = () => {
    const { score, distance, lives, displayQuestion, feedbackMessage } = useGameStore();

    return (
        <>
            {/* Top Bar - stats */}
            <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start pointer-events-none z-10">
                <div className="bg-white/90 p-3 rounded-xl shadow-lg border-b-4 border-blue-500">
                    <h2 className="text-2xl font-black text-blue-900">Points: {Math.floor(score)}</h2>
                </div>

                {/* Lives */}
                <div className="flex gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className={`text-4xl transition-all ${i < lives ? "scale-100" : "scale-75 opacity-30 grayscale"}`}>
                            ❤️
                        </div>
                    ))}
                </div>

                <div className="bg-white/90 p-3 rounded-xl shadow-lg border-b-4 border-green-500">
                    <h2 className="text-2xl font-black text-green-900">{Math.floor(distance)}m</h2>
                </div>
            </div>

            {/* Question Bar */}
            <div className="absolute top-24 left-1/2 transform -translate-x-1/2 pointer-events-none z-10 w-full max-w-2xl px-4">
                <div className="bg-black/70 backdrop-blur-md p-4 rounded-2xl border-4 border-yellow-400 text-center shadow-[0_0_20px_rgba(250,204,21,0.5)]">
                    <h2 className="text-4xl text-yellow-300 font-mono font-bold tracking-widest drop-shadow-md">
                        {displayQuestion}
                    </h2>
                </div>
            </div>

            {/* Feedback Message */}
            {feedbackMessage && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-bounce">
                    <div className="bg-red-600 text-white px-8 py-6 rounded-3xl border-4 border-white shadow-2xl skew-x-[-10deg]">
                        <h1 className="text-5xl font-black uppercase italic tracking-tighter">
                            {feedbackMessage}
                        </h1>
                    </div>
                </div>
            )}
        </>
    );
};

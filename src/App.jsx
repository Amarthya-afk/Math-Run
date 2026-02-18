import { Scene } from './components/Game/Scene';
import { Hud } from './components/UI/Hud';
import { useGameStore } from './store/useGameStore';

function App() {
  const { isPlaying, isGameOver, score, startGame, runId } = useGameStore();

  return (
    <div className="w-full h-screen relative bg-sky-300">
      <Scene key={runId} />
      <Hud />
      {/* MathOverlay removed as requested */}

      {/* Start Screen */}
      {!isPlaying && !isGameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 z-50 backdrop-blur-sm">
          <h1 className="text-6xl font-black text-white mb-8 drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] tracking-wider">
            MATH RUN
          </h1>
          <button
            onClick={startGame}
            className="px-10 py-5 bg-gradient-to-b from-yellow-400 to-yellow-500 text-black font-black text-3xl rounded-2xl hover:scale-110 hover:rotate-1 transition-all shadow-[0_10px_0_rgb(161,104,10)] active:shadow-none active:translate-y-2 border-4 border-yellow-700"
          >
            START RUN
          </button>
          <div className="mt-8 text-white text-xl font-bold bg-black/50 p-4 rounded-xl">
            <p>⬅️ ➡️ to Change Lanes</p>
            <p>⬆️ or Space to Jump</p>
            <p>Run through the Correct Answer!</p>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {isGameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/80 z-50 backdrop-blur-md animate-fade-in">
          <h1 className="text-7xl font-black text-white mb-4 drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]">
            GAME OVER
          </h1>
          <div className="bg-white p-6 rounded-2xl shadow-xl mb-8 text-center rotate-2">
            <p className="text-2xl text-gray-600 font-bold uppercase">Final Score</p>
            <p className="text-6xl text-black font-black">{Math.floor(score)}</p>
          </div>
          <button
            onClick={startGame}
            className="px-10 py-5 bg-gradient-to-b from-green-400 to-green-500 text-white font-black text-3xl rounded-2xl hover:scale-110 hover:-rotate-1 transition-all shadow-[0_10px_0_rgb(21,128,61)] active:shadow-none active:translate-y-2 border-4 border-green-700"
          >
            TRY AGAIN
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

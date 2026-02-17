import { useGameStore } from '../../store/useGameStore';

export const Hud = () => {
    const { score, distance } = useGameStore();

    return (
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between pointer-events-none z-10">
            <div className="bg-white/80 p-2 rounded-lg shadow-md border-2 border-blue-500">
                <h2 className="text-xl font-bold text-blue-900">Score: {Math.floor(score)}</h2>
            </div>
            <div className="bg-white/80 p-2 rounded-lg shadow-md border-2 border-green-500">
                <h2 className="text-xl font-bold text-green-900">Distance: {Math.floor(distance)}m</h2>
            </div>
        </div>
    );
};

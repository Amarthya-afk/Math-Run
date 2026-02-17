import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Player } from './Player';
import { Track } from './Track';
import { GameManager } from './GameManager';

export const Scene = () => {
    return (
        <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
            <color attach="background" args={['#87CEEB']} />
            <fog attach="fog" args={['#87CEEB', 20, 60]} />
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
            <Suspense fallback={null}>
                <GameManager />
                <Player />
                <Track />
            </Suspense>
        </Canvas>
    );
};

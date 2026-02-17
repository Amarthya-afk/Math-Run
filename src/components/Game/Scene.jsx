import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Player } from './Player';
import { Track } from './Track';
import { GameManager } from './GameManager';

export const Scene = () => {
    return (
        <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
            <color attach="background" args={['#87CEEB']} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
            <Suspense fallback={null}>
                <GameManager />
                <Player />
                <Track />
            </Suspense>
        </Canvas>
    );
};

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Player } from './Player';
import { Track } from './Track';
import { GameManager } from './GameManager';

export const Scene = () => {
    return (
        <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
            {/* Vibrant Sky */}
            <color attach="background" args={['#4FC3F7']} />
            <fog attach="fog" args={['#4FC3F7', 30, 90]} />

            <ambientLight intensity={0.9} />
            <directionalLight position={[20, 30, 10]} intensity={1.8} castShadow shadow-mapSize={[1024, 1024]} />
            <hemisphereLight intensity={0.5} groundColor="#7CB342" />
            <Suspense fallback={null}>
                <GameManager />
                <Player />
                <Track />
            </Suspense>
        </Canvas>
    );
};

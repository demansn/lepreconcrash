import React, {useEffect, useState} from 'react';
import {game} from "../game/Game";

const LoadingScreen = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        game.on('assetsLoading', (value) => {
            setProgress(value);
        });
    }, []);

    return (
        <div className="loading-screen">
            <h1>Loading...</h1>
            <p>Progress:{progress}</p>
        </div>
    );
};

export default LoadingScreen;

import React, {useEffect, useState} from "react";
import { createRoot } from 'react-dom/client';
import ReactDOM from "react-dom";
import LoadingScreen from './screens/LoadingScreen';
import GameScreen from './screens/GameScreen';
import {game} from "./game/Game";

const App = () => {
    const [loading, setLoading] = useState(true);
    const onLoaded = () => {
        setLoading(false);
    }

    useEffect(() => {
        game.init();
        game.on('assetsLoaded', onLoaded);

        window.Telegram.WebApp.expand();

        return () => game.off('assetsLoaded', onLoaded);
    }, []);

    return (
        <div className="app">
            {loading ? <LoadingScreen /> : <GameScreen />}
        </div>
    );
};

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App />);

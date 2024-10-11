import React, { useRef, useEffect, useState } from 'react';
import {Box, AppBar, Toolbar, Typography, Button, Stack, TextField, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText} from '@mui/material';
import {game} from "../game/Game";
import BottomPanel from "./BottomPanel";

const GameScreen = () => {
    const gameContainerRef = useRef(null);

    useEffect(async () => {
        gameContainerRef.current.appendChild(game.app.view);
        return () => {
            // app.destroy(true, true);
        };
    }, []);

    return (
        <Box sx={{height: '100vh', width: '100vw'}}  >
            <Box
                sx={{
                    position: 'relative',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                }}
                        ref={gameContainerRef}
                    />
            <BottomPanel />
        </Box>
    );
};

export default GameScreen;

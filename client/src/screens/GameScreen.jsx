import React, { useRef, useEffect, useState } from 'react';
import {Box, AppBar, Toolbar, Typography, Button, Stack, TextField, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText} from '@mui/material';
import {game} from "../game/Game";
import BottomPanel from "./BottomPanel";

const GameScreen = () => {
    const gameContainerRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [result, setResult] = useState(null);
    const [disabledButton, setDisabledButtons] = useState(false);

    const handleClose = () => {
        setOpen(false);
        setResult(null);
        game.reset();
        setDisabledButtons(false);
    };

    useEffect(async () => {
        gameContainerRef.current.appendChild(game.app.canvas);
        return () => {
            // app.destroy(true, true);
        };
    }, []);

    return (
        <Box sx={{height: '100vh', width: '100vw'}}  >
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {result && result.isWin ? `You win: ${result.totalWin}` : 'You lose!'}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose}>close</Button>
                </DialogActions>
            </Dialog>
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

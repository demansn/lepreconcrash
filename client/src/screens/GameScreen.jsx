import React, { useRef, useEffect, useState } from 'react';
import {Box, AppBar, Toolbar, Typography, Button, Stack, TextField, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText} from '@mui/material';
import {game} from "../game/Game";

const GameScreen = () => {
    const gameContainerRef = useRef(null);
    const [open, setOpen] = useState(false);
    const {balance, luck, round} = game.getInfo();
    const [result, setResult] = useState(null);
    const [roundInfo, setRoundInfo] = useState(round);
    const [playerBalance, setPlayerBalance] = useState(balance);
    const [playerLuck, setPlayerLuck] = useState(luck);
    const [disabledButton, setDisabledButtons] = useState(false);
    const updatePlayerInfo = () => {
        const {balance, luck, round} = game.getInfo();
        setPlayerBalance(balance);
        setPlayerLuck(luck);
        setRoundInfo(round);
    };

    const onClickBet = async (betAmount) => {
            game.placeBet(betAmount);
            setDisabledButtons(false);
           updatePlayerInfo();
    };
    const onClickGo = async () => {
        setDisabledButtons(true);
        const result = await game.go();
        updatePlayerInfo();

        if (result.isWin || result.isLose) {
            setOpen(true);
            setResult(result);
        } else {
            setDisabledButtons(false);
        }
    };

    const onClickCashOut = async () => {
        setDisabledButtons(true);
        const result = await game.cashOut();
        updatePlayerInfo();

        if (result.isWin || result.isLose) {
            setOpen(true);
            setResult(result);
        } else {
            setDisabledButtons(false);
        }
    };

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
        <Box sx={{height: '100vh' }}>
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
        </Box>
    );
};

const GamePlayToolbar = ({onClickGo, onClickCashOut, cashOutIsDisabled = false, goIsDisabled = false}) => {
    return (
        <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" color="secondary" size="large" onClick={onClickCashOut} disabled={cashOutIsDisabled}>
                Cash out
            </Button>
            <Button variant="contained" color="secondary" size="large" onClick={onClickGo} disabled={goIsDisabled}>
                Go
            </Button>
        </Box>
    );
}

const PlaceBetToolbar = ({onClickBet}) => {
    return (
        <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" color="secondary" size="large" onClick={() => onClickBet(10)}>
                Bet 10
            </Button>
        </Box>
    );
}

export default GameScreen;

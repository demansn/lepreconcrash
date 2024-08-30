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
    const updatePlayerInfo = () => {
        const {balance, luck, round} = game.getInfo();
        setPlayerBalance(balance);
        setPlayerLuck(luck);
        setRoundInfo(round);
    };

    const onClickBet = (betAmount) => {
            game.placeBet(betAmount);
           updatePlayerInfo();
    };
    const onClickGo = async () => {
        const result = await game.go();
        updatePlayerInfo();

        if (result.isWin || result.isLose) {
            setOpen(true);
            setResult(result);
            game.reset();
        }
    };

    const onClickCashOut = async () => {
        const result = await game.cashOut();
        updatePlayerInfo();

        if (result.isWin || result.isLose) {
            setOpen(true);
            setResult(result);
            game.reset();
        }
    };

    const handleClose = () => {
        setOpen(false);
        setResult(null);
    };

    useEffect(async () => {
        gameContainerRef.current.appendChild(game.app.canvas);
        return () => {
            // app.destroy(true, true);
        };
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
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
            <AppBar position="static">
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="caption">Balance</Typography>
                        <Typography variant="h6" sx={{ color: 'yellow', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                            {playerBalance}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="caption">Luck</Typography>
                        <Typography variant="h6" sx={{ color: 'yellow', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                            {playerLuck}
                        </Typography>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        height: 0,
                        paddingBottom: '120%',
                        position: 'relative',
                        maxWidth: { xs: '100%', sm: '80%', md: '60%' }, // Responsive width for different screens
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                        }}
                        ref={gameContainerRef}
                    />
                </Box>
            </Box>
            <AppBar
                position="static"
                sx={{
                    top: 'auto',
                    bottom: 0,
                    height: { xs: '30%', sm: '35%', md: '40%' }, // Responsive height
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Toolbar>
                    {round ? (
                        <GamePlayToolbar
                            onClickCashOut={onClickCashOut}
                            onClickGo={onClickGo}
                            cashOutIsDisabled={round && round.step <= 0}
                        />
                    ) : (
                        <PlaceBetToolbar onClickBet={onClickBet} />
                    )}
                </Toolbar>
            </AppBar>
        </Box>

    );
};

const GamePlayToolbar = ({onClickGo, onClickCashOut, cashOutIsDisabled = false}) => {
    return (
        <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" color="secondary" size="large" onClick={onClickCashOut} disabled={cashOutIsDisabled}>
                Cash out
            </Button>
            <Button variant="contained" color="secondary" size="large" onClick={onClickGo}>
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

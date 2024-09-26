import React from 'react';
import { Box, IconButton } from '@mui/material';

const BottomPanel = () => {
    return (
        <Box
            sx={{
                position: 'absolute',
                bottom: 0,
                width: '98%',
                height: '10%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Прозрачный фон
                display: 'flex',
                justifyContent: 'space-between', // Равномерное распределение кнопок
                alignItems: 'center',
                // padding: '0 20px',
                // gap: '20px',
                margin: '1%',
                zIndex: 10,
            }}
        >
            <Button icon="./assets/ui/icon1.png" />
            <Button icon="./assets/ui/icon2.png" />
            <Button icon="./assets/ui/icon3.png" />
            <Button icon="./assets/ui/icon4.png" />
            <Button icon="./assets/ui/icon5.png" />
        </Box>
    );
};

export default BottomPanel;

const Button = ({icon}) => {
    return (
        <IconButton sx={{width: '18%' }}>
            <img src={icon} alt="Icon" style={{ width: '100%', height: 'auto' }} />
        </IconButton>
    );
}

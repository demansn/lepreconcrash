export const manifest = {
    bundles: [
        {
            name: 'game',
            assets: [
                {
                    alias: 'bg',
                    src: './assets/background.jpg',
                },  {
                    alias: 'hero',
                    src: './assets/Character.png',
                },
                {alias: 'platform', src: './assets/cloud.png'},
                {alias: 'bonus', src: './assets/bonus.png'},
                {alias: 'balancePanelBg', src: './assets/Gold_plank.png'},
                {alias: 'lackPanelBg', src: './assets/Clover plank.png'},
                {alias: 'playButton', src: './assets/Play.png'},
                {alias: 'heroNormal', src: './assets/1.png'},
                {alias: 'heroJump', src: './assets/2.png'},
                {alias: 'goButton', src: './assets/Go.png'},
                {alias: 'centerButton', src: './assets/Centr but.png'},
                {alias: 'goldIconCenter', src: './assets/Gold Centr.png'},
                {alias: 'goldCloverCenter', src: './assets/Clover centr.png'},
                {alias: 'animations', src: './assets/animations-0.json'},
                {alias: 'mainMusic', src: './assets/sound/WOW Sound_CGM_Level_2_noPer.mp3'},
                {alias: 'cashGrab', src: './assets/sound/cash-grab-button.mp3'},
                {alias: 'jump', src: './assets/sound/jump.mp3'},
                {alias: 'landing', src: './assets/sound/landing.mp3'},
                {alias: 'crash', src: './assets/sound/Leprecon Crash 04.mp3'},
                {alias: 'bonusWin', src: './assets/sound/activate_bonus_L.mp3'},
                {
                    alias: 'font',
                    src: './assets/fonts/AldotheApache.ttf',
                    data: {
                        family: 'AldotheApache',
                        weights: ['normal', 'bold'],
                    }}
            ],
        },
    ],
};

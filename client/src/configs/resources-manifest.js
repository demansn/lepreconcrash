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

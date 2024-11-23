import {GamePlayState} from "../game/states/gamePlay/GamePlayState.js";
import {AssetsLoading} from "../game/states/AssetsLoading.js";
import {OnboardingScene} from "../game/scenes/OnboardingScene.js";
import {LoadingScene} from "../game/scenes/LoadingScene.js";
import {OnboardingState} from "../game/states/OnboardingState.js";
import {Footer} from "../game/scenes/footer/Footer.js";
import {GamePlayScene} from "../game/scenes/gamePlay/GamePlayScene.js";
import {FriendsState} from "../game/states/FriendsState.js";
import {ShopState} from "../game/states/ShopState.js";
import {EarnState} from "../game/states/EarnState.js";
import {LeaderboardState} from "../game/states/LeaderboardState.js";
import {HeaderScene} from "../game/scenes/header/HeaderScene.js";
import {SessionExpired} from "../game/scenes/popupManager/popup/SessionExpired.js";
import {MessagePopup} from "../game/scenes/popupManager/popup/MessagePopup.js";
import {PlaceBetState} from "../game/states/gamePlay/substates/PlaceBetState.js";
import {CashOutStateState} from "../game/states/gamePlay/substates/CashOutState.js";
import {PlayState} from "../game/states/gamePlay/substates/PlayState.js";
import {LoseState} from "../game/states/gamePlay/substates/LoseState.js";
import {InitGamePlayState} from "../game/states/gamePlay/substates/InitGamePlayState.js";
import {ShopScene} from "../game/scenes/ShopScene.js";
import {FriendsScene} from "../game/scenes/FriendsScene.js";
import {EarnScene} from "../game/scenes/EarnScene.js";
import {LeaderboardScene} from "../game/scenes/LeaderboardScene.js";

export const GameConfig = {
    PixiApplication: {
            containerId: 'root',
            width: 712,
            height: 1280,
            backgroundColor: 0x1099bb,
            antialias: true,
            resolution: window.devicePixelRatio || 1,
        },
    size: {
        width: 712,
        height: 1280,
    },
    statesIcons: {
        earn: {
            icon: 'Earn',
            state: 'EarnState',
        },
        friends: {
            icon: 'Friends',
            state: 'FriendsState',
        },
        play: {
            icon: 'Play',
            state: 'GamePlayState',
        },
        shop: {
            icon: 'Shop',
            state: 'ShopState',
        },
        leaderboard: {
            icon: 'Leaderboard',
            state: 'LeaderboardState',
        }
    },
    StateController: {
        states: {
            AssetsLoading: {
                Class: AssetsLoading,
                context: {
                    logic: 'GameLogic',
                }
            },
            OnboardingState,
            GamePlayState: {
                Class: GamePlayState,
                context: {
                    logic: 'GameLogic',
                    PixiApplication: 'PixiApplication',
                },
                scenes: {
                    gamePlayScene: 'GamePlayScene',
                    header: 'HeaderScene',
                    footer: 'Footer',
                },
                states: {
                    InitGamePlayState,
                    PlaceBetState,
                    PlayState,
                    LoseState,
                    CashOutStateState,
                }
            },
            FriendsState: {
                Class: FriendsState,
                options: {
                    screen: {
                        scene: 'FriendsScene',
                        name: 'friends',
                    }
                },
                context: {
                    logic: 'GameLogic',
                },
                scenes: {
                    shop: 'FriendsScene',
                    header: 'HeaderScene',
                    footer: 'Footer',
                }
            },
            ShopState: {
                Class: ShopState,
                options: {
                    screen: {
                        scene: 'ShopScene',
                        name: 'shop',
                    }
                },
                context: {
                    logic: 'GameLogic',
                },
                scenes: {
                    shop: 'ShopScene',
                    header: 'HeaderScene',
                    footer: 'Footer',
                }
            },
            EarnState: {
                Class: EarnState,
                options: {
                    screen: {
                        scene: 'EarnScene',
                        name: 'earn',
                    }
                },
                context: {
                    logic: 'GameLogic',
                },
                scenes: {
                    earn: 'EarnScene',
                    header: 'HeaderScene',
                    footer: 'Footer',
                }
            },
            LeaderboardState: {
                Class: LeaderboardState,
                options: {
                    screen: {
                        scene: 'LeaderboardScene',
                        name: 'leaderboard',
                    }
                },
                context: {
                    logic: 'GameLogic',
                },
                scenes: {
                    shop: 'LeaderboardScene',
                    header: 'HeaderScene',
                    footer: 'Footer',
                }
            },
        },
        enterState: 'AssetsLoading'
    },
    popups: [
        SessionExpired,
        MessagePopup
    ],
    SceneManager: {
        scenes: {
            LoadingScene: LoadingScene,
            OnboardingScene: OnboardingScene,
            Footer: Footer,
            HeaderScene: HeaderScene,
            GamePlayScene: GamePlayScene,
            ShopScene: ShopScene,
            FriendsScene: FriendsScene,
            EarnScene: EarnScene,
            LeaderboardScene: LeaderboardScene,
        }
    }
};

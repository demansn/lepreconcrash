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
import {CashOutState} from "../game/states/gamePlay/substates/CashOutState.js";
import {PlayState} from "../game/states/gamePlay/substates/PlayState.js";
import {LoseState} from "../game/states/gamePlay/substates/LoseState.js";
import {InitGamePlayState} from "../game/states/gamePlay/substates/InitGamePlayState.js";
import {ShopScene} from "../game/scenes/shop/ShopScene.js";
import {FriendsScene} from "../game/scenes/friends/FriendsScene.js";
import {EarnScene} from "../game/scenes/EarnScene.js";
import {LeaderboardScene} from "../game/scenes/leaderboard/LeaderboardScene.js";
import {RewardDailyScene} from "../game/scenes/RewardDailyScene.js";
import {WinState} from "../game/states/gamePlay/substates/WinState.js";
import {MyProfileScene} from "../game/scenes/myProfile/MyProfileScene.js";
import {MyProfileState} from "../game/states/MyProfileState.js";
import {TelemetreeProvider} from "../analitics/TelemetreeProvider.js";
import {SlotMachine} from "../game/gameObjects/slot/SlotMachine.js";
import {SlotState} from "../SlotState.js";
import {SlotGameScene} from "../game/scenes/slotgame/SlotGameScene.js";
import {BonusGameState} from "../game/states/gamePlay/substates/BonusGameState.js";
import {GamesState} from "../game/states/games/GamesState.js";
import {GamesScene} from "../game/scenes/games/GamesScene.js";
import {SelectGameState} from "../game/states/games/SelectGameState.js";
import {SlotGameState} from "../game/states/games/SlotGameState.js";
import {CookieGameState} from "../game/states/games/CookieGameState.js";

export const GameConfig = {
    AnalystService: {
        providers: [
            {
                name: 'TelemetreeProvider',
                Constructor: TelemetreeProvider,
                options: {
                    projectId: TELEMETREE_PROJECT_ID,
                    apiKey: TELEMETREE_API_KEY,
                    appName: TELEMETREE_APP_NAME,
                }
            },
        ]
    },
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
        games: {
            icon: 'Games',
            state: 'GamesState',
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
                    CashOutState,
                    WinState,
                    BonusGameState
                }
            },
            GamesState: {
                Class: GamesState,
                options: {
                    screen: {
                        scene: 'GamesScene',
                        name: 'games',
                    }
                },
                context: {
                    logic: 'GameLogic',
                },
                scenes: {
                    screen: 'GamesScene',
                    header: 'HeaderScene',
                    footer: 'Footer',
                },
                states: {
                    SlotGameState,
                    CookieGameState,
                    SelectGameState
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
                    screen: 'ShopScene',
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
                    ads: 'TabsWidget',
                    analytics: 'AnalystService',
                },
                scenes: {
                    earn: 'EarnScene',
                    header: 'HeaderScene',
                    footer: 'Footer',
                    rewardDailyPopup: 'RewardDailyScene',
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
                    screen: 'LeaderboardScene',
                    header: 'HeaderScene',
                    footer: 'Footer',
                }
            },
            MyProfileState: {
                Class: MyProfileState,
                options: {
                    screen: {
                        scene: 'MyProfileScene',
                        name: 'myProfile',
                    }
                },
                context: {
                    logic: 'GameLogic',
                },
                scenes: {
                    screen: 'MyProfileScene',
                    header: 'HeaderScene',
                    footer: 'Footer',
                }
            },
            SlotState: {
                Class: SlotState,
                context: {
                    logic: 'GameLogic',
                },
                scenes: {
                    slotGameScene: 'SlotGameScene',
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
            GamesScene,
            EarnScene: EarnScene,
            LeaderboardScene: LeaderboardScene,
            RewardDailyScene: RewardDailyScene,
            MyProfileScene: MyProfileScene,
            SlotGameScene: SlotGameScene,
        }
    }
};

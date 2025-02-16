import {ScreenState} from "./ScreenState.js";

export class MyProfileState extends ScreenState {
    enter() {
        super.enter();

         this.screen.on('invite', this.onClickInvite, this);
         this.screen.on('checkProgress', this.onClickCheckProgress, this);
            this.screen.on('gameRules', this.onClickGameRules, this);
            this.screen.on('faq', this.onClickFAQ, this);

        this.setScreenData();
    }

    onClickInvite() {
        this.owner.goTo('EarnState')
    }

    onClickCheckProgress() {
        this.owner.goTo('LeaderboardState');
    }

    onClickGameRules() {
        document.getElementById('gameRulesPopupContainer').style.display = 'flex'
        document.getElementById('gameRulesCloseButton').onclick = () => {
            document.getElementById('gameRulesPopupContainer').style.display = 'none'
        }
    }

    onClickFAQ() {
        document.getElementById('faqPopupContainer').style.display = 'flex'
        document.getElementById('faqCloseButton').onclick = () => {
            document.getElementById('faqPopupContainer').style.display = 'none'
        }
    }

    exit() {
        super.exit();
        this.screen.off('invite', this.onClickInvite, this);
        this.screen.off('checkProgress', this.onClickCheckProgress, this);
        this.screen.off('gameRules', this.onClickGameRules, this);
        this.screen.off('faq', this.onClickFAQ, this);
    }

    async setScreenData() {
        this.screen.setData(this.logic.player);
    }
}

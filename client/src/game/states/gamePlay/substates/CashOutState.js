import {GameBaseState} from "../../GameBaseState.js";

export class CashOutState extends GameBaseState {
    async enter() {
        await this.owner.cashOut();
        this.owner.goTo('PlaceBetState');
    }
}
